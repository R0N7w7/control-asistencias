// app/api/asistencias/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Asistencia = {
  fecha: string
  duracion: number
  estado: string
  hora_inicio?: string
  hora_fin?: string
  actividades?: string
}

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let asistencia: Asistencia

  try {
    asistencia = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido, no es JSON válido' }, { status: 400 })
  }

  const { fecha, duracion, estado } = asistencia

  if (!fecha || typeof duracion !== 'number' || !estado) {
    return NextResponse.json({ error: 'Campos requeridos faltantes o inválidos' }, { status: 400 })
  }

  const { error: insertError } = await supabase.from('asistencias').insert([
    {
      user_id: user.id,
      ...asistencia,
    },
  ])

  if (insertError) {
    console.error(insertError)
    return NextResponse.json({ error: 'Error al registrar la asistencia' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Asistencia registrada correctamente' }, { status: 201 })
}

export async function DELETE(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let requestBody: { fecha?: string };

  try {
    requestBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido, no es JSON válido' }, { status: 400 });
  }

  const { fecha } = requestBody;

  if (!fecha) {
    console.log("Fecha no proporcionada en el body");
    return NextResponse.json({ error: 'La fecha es requerida en el body' }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from('asistencias')
    .delete()
    .eq('user_id', user.id)
    .eq('fecha', fecha);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json({ error: 'Error al eliminar la asistencia' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Asistencia eliminada correctamente' }, { status: 200 });
}