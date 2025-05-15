import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type AsistenciaConPerfil = {
  user_id: string;
  fecha: string;
  duracion: number;
  actividades: string;
  user_profiles: {
    nombre: string;
  } | null;
};


export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // ⚠️ (Opcional) Verificar si el usuario es admin

  // Traer asistencias con estado 'pendiente' y unir con los perfiles
  const { data: pendientes, error } = await supabase
    .from('asistencias')
    .select(`
    user_id,
    fecha,
    duracion,
    actividades,
    user_profiles(nombre)
  `)
    .eq('estado', 'pendiente')
    .order('fecha', { ascending: false }) as unknown as { data: AsistenciaConPerfil[]; error: unknown }


  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error obteniendo asistencias pendientes' }, { status: 500 })
  }

  // Formatear para que sea más limpio el JSON de salida
  const resultado = pendientes.map((registro) => ({
    user_id: registro.user_id,
    nombre: registro.user_profiles?.nombre ?? 'Desconocido',
    fecha: registro.fecha,
    duracion: registro.duracion,
    actividades: registro.actividades,
  }))

  return NextResponse.json({ pendientes: resultado })
}

// POST: Actualizar asistencia
export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { user_id, fecha, payload } = body

  if (!user_id || !fecha || !payload) {
    return NextResponse.json({ error: 'Faltan datos necesarios' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('asistencias')
    .update(payload)
    .eq('user_id', user_id)
    .eq('fecha', fecha)

  if (updateError) {
    console.error(updateError)
    return NextResponse.json({ error: 'Error al actualizar la asistencia' }, { status: 500 })
  }

  return NextResponse.json({ mensaje: 'Asistencia actualizada correctamente' })
}