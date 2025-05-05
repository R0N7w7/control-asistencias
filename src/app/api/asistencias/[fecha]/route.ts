import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { fecha: string } }
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { fecha } = await params;

  if (!fecha) {
    console.log("Fecha no proporcionada")
    return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  }

  const { error } = await supabase
    .from('asistencias')
    .delete()
    .eq('user_id', user.id)
    .eq('fecha', fecha)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al eliminar asistencia' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Asistencia eliminada correctamente' }, { status: 200 })
}