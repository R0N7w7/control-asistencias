// app/api/horas/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const userId = user.id;

  const { data: horas, error: horasError } = await supabase
    .from('asistencias')
    .select('fecha, duracion, estado, hora_inicio, hora_fin, actividades')
    .eq('user_id', userId)
    .order('fecha', { ascending: false }) // Más reciente primero


  if (horasError) {
    console.error(horasError)
    return NextResponse.json({ error: 'Error obteniendo las horas' }, { status: 500 })
  }

  const { data: practicante, error: practicanteError } = await supabase
    .from('user_profiles')
    .select('nombre, horasTotales')
    .eq('id', userId)
    .single()

  if (practicanteError) {
    console.error(practicanteError)
    return NextResponse.json({ error: 'Error obteniendo el practicante' }, { status: 500 })
  }

  return NextResponse.json({ practicante, horas })
}



export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Falta el userId en el body' }, { status: 400 });
  }

  const { data: horas, error: horasError } = await supabase
    .from('asistencias')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false });

  if (horasError) {
    console.error(horasError);
    return NextResponse.json({ error: 'Error obteniendo las horas' }, { status: 500 });
  }

  const { data: practicante, error: practicanteError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (practicanteError) {
    console.error(practicanteError);
    return NextResponse.json({ error: 'Error obteniendo el practicante' }, { status: 500 });
  }

  return NextResponse.json({ practicante, horas });
}
