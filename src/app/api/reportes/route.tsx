import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type AsistenciaConPerfil = {
  user_id: string;
  fecha: string;
  estado: string;
  duracion: number;
  hora_inicio: string;
  hora_fin: string;
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

    // 1. Obtener asistencias con perfil de usuario
    const { data: asistencias, error: asistenciasError } = await supabase
        .from('asistencias')
        .select(`
      user_id,
      fecha,
      duracion,
      estado,
      hora_inicio,
      hora_fin,
      actividades,
      user_profiles(nombre)
    `)
        .order('fecha', { ascending: false }) as unknown as { data: AsistenciaConPerfil[]; error: unknown }

    if (asistenciasError) {
        console.error(asistenciasError)
        return NextResponse.json({ error: 'Error obteniendo asistencias' }, { status: 500 })
    }

    // 2. Agrupar por ID de usuario, incluyendo el nombre como campo
    const agrupadas = asistencias.reduce((acc, asistencia) => {
        const id = asistencia.user_id
        const nombre = asistencia.user_profiles?.nombre  ?? 'Desconocido'

        if (!acc[id]) {
            acc[id] = {
                nombre,
                asistencias: []
            }
        }

        acc[id].asistencias.push({
            fecha: asistencia.fecha,
            duracion: asistencia.duracion,
            estado: asistencia.estado,
            hora_inicio: asistencia.hora_inicio,
            hora_fin: asistencia.hora_fin,
            actividades: asistencia.actividades
        })

        return acc
    }, {} as Record<string, {
        nombre: string
        asistencias: Array<{
            fecha: string
            duracion: number
            estado: string
            hora_inicio?: string
            hora_fin?: string
            actividades?: string
        }>
    }>)

    return NextResponse.json(agrupadas)
}