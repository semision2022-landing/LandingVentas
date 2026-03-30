import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Solo estos archivos están permitidos (whitelist de seguridad)
const ALLOWED: Record<string, string> = {
  'politica-proteccion-datos.pdf':  'politica-proteccion-datos.pdf',
  'terminos-y-condiciones.pdf':     'terminos-y-condiciones.pdf',
  'politica-devoluciones.pdf':      'politica-devoluciones.pdf',
}

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get('file') ?? ''

  if (!ALLOWED[filename]) {
    return new NextResponse('No encontrado', { status: 404 })
  }

  const filePath = join(process.cwd(), 'public', ALLOWED[filename])

  try {
    const buffer = await readFile(filePath)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        // PDF inline — sin descarga automática
        'Content-Type':        'application/pdf',
        'Content-Disposition': 'inline',
        // Permitir embed desde el mismo origen (essential for iframe)
        'X-Frame-Options':     'SAMEORIGIN',
        'Cache-Control':       'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('Archivo no encontrado', { status: 404 })
  }
}
