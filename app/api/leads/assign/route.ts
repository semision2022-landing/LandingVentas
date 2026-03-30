import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendLeadAssignmentEmail } from '@/lib/resend'

// Usamos el service_role para poder leer assignment_counter y agents sin RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const { conversationId, source } = await req.json()

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId requerido' }, { status: 400 })
    }

    // 1. Obtener lista de agentes con rol 'agent' ordenados por nombre (consistente)
    const { data: agents, error: agentsErr } = await supabaseAdmin
      .from('agents')
      .select('id, name, email')
      .eq('role', 'agent')
      .order('name', { ascending: true })

    if (agentsErr || !agents || agents.length === 0) {
      console.error('[assign-lead] Sin agentes disponibles:', agentsErr)
      return NextResponse.json({ error: 'Sin agentes disponibles' }, { status: 500 })
    }

    // 2. Obtener el índice actual del round-robin
    const { data: counter } = await supabaseAdmin
      .from('assignment_counter')
      .select('last_index')
      .eq('id', 1)
      .single()

    const currentIndex = counter?.last_index ?? 0
    const nextIndex = (currentIndex + 1) % agents.length
    const assignedAgent = agents[nextIndex]

    // 3. Actualizar el turno
    await supabaseAdmin
      .from('assignment_counter')
      .update({ last_index: nextIndex })
      .eq('id', 1)

    // 4. Asignar el lead
    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('conversations')
      .update({
        assigned_to: assignedAgent.id,
        assigned_agent: assignedAgent.name,   // campo legado visible en UI
        lead_source: source ?? 'whatsapp',
      })
      .eq('id', conversationId)
      .select('visitor_name, visitor_email, visitor_phone, plan_interest')
      .single()

    if (convErr) {
      console.error('[assign-lead] Error actualizando conversación:', convErr)
      return NextResponse.json({ error: 'Error asignando lead' }, { status: 500 })
    }

    // 5. Notificar al asesor por email
    await sendLeadAssignmentEmail({
      agentName:    assignedAgent.name,
      agentEmail:   assignedAgent.email,
      leadName:     conversation?.visitor_name  ?? 'Visitante',
      leadEmail:    conversation?.visitor_email ?? '—',
      leadPhone:    conversation?.visitor_phone ?? '—',
      planInterest: conversation?.plan_interest ?? '—',
      source:       source ?? 'whatsapp',
      adminUrl:     `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://ventas.emision.co'}/admin/conversations`,
    })

    return NextResponse.json({
      ok: true,
      assignedTo: assignedAgent.name,
      agentEmail: assignedAgent.email,
    })
  } catch (err) {
    console.error('[assign-lead]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
