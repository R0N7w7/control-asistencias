import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // ⚠️ Aquí podrías agregar una verificación de que el usuario es admin, si aplica

  // 1. Obtener todas las asistencias (de todos los usuarios)
  const { data: asistencias, error: asistenciasError } = await supabase
    .from('asistencias')
    .select('estado, duracion')

  if (asistenciasError) {
    console.error(asistenciasError)
    return NextResponse.json({ error: 'Error obteniendo las asistencias' }, { status: 500 })
  }

  // 2. Calcular totales
  let totalHorasValidadas = 0
  let totalHorasPendientes = 0
  let totalFaltas = 0

  for (const asistencia of asistencias) {
    if (asistencia.estado === 'validado') {
      totalHorasValidadas += asistencia.duracion ?? 0
    } else if (asistencia.estado === 'pendiente') {
      totalHorasPendientes += asistencia.duracion ?? 0
    } else if (asistencia.estado === 'falta') {
      totalFaltas += 1
    }
  }

  // 3. Obtener total de practicantes
  const { data: practicantes, error: practicantesError } = await supabase
    .from('user_profiles')
    .select('id') // solo necesitamos los IDs
    .eq('rol', 'practicante')

  if (practicantesError) {
    console.error(practicantesError)
    return NextResponse.json({ error: 'Error obteniendo practicantes' }, { status: 500 })
  }

  const totalPracticantes = practicantes.length

  // 🎉 Resumen final
  return NextResponse.json({
    resumen: {
      totalHorasValidadas,
      totalHorasPendientes,
      totalFaltas,
      totalPracticantes,
    },
  })
}
