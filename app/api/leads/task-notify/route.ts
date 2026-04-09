import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendTaskNotificationEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { leadId, taskTitle, taskDueDate } = await req.json()
    if (!leadId || !taskTitle) {
      return NextResponse.json({ error: 'leadId y taskTitle son requeridos' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get lead + assigned agent info
    const { data: lead } = await supabase
      .from('conversations')
      .select('visitor_name, visitor_email, visitor_phone, assigned_to, agents!assigned_to(name, email)')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    }

    const agentData = lead.agents as { name: string; email: string } | null
    const agentName  = agentData?.name  ?? 'Asesor'
    const agentEmail = agentData?.email ?? null

    if (!agentEmail) {
      console.warn('[task-notify] Lead sin agente asignado, solo se notifica a admins')
    }

    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://ventas.emision.co'}/admin/leads`

    await sendTaskNotificationEmail({
      agentName,
      agentEmail: agentEmail ?? 'direccioncomercial@emision.co',
      leadName:   lead.visitor_name  ?? 'Visitante',
      leadEmail:  lead.visitor_email ?? null,
      leadPhone:  lead.visitor_phone ?? null,
      taskTitle,
      taskDueDate: taskDueDate ?? null,
      adminUrl,
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[task-notify]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
