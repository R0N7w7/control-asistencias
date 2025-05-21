import { supabaseAdmin } from '@/lib/supabase/admin'
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

  // Traer todos los perfiles con el correo del usuario
  const { data: perfiles, error: perfilesError } = await supabase
    .from('user_profiles')
    .select(`
      *
    `)
    .eq('rol', 'practicante')

  if (perfilesError) {
    console.error(perfilesError)
    return NextResponse.json({ error: 'Error obteniendo perfiles' }, { status: 500 })
  }

  return NextResponse.json({ perfiles })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { email, password, nombre, carrera, telefono, horasTotales, fechaInicio, fechaTermino } = body

  // 1. Crear usuario en Auth
  const {
    data: userData,
    error: userError,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // opcional, según tu flujo
  })

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Fallo al crear usuario en Auth', detalles: userError }, { status: 500 })
  }

  const userId = userData.user.id

  // 2. Crear perfil en user_profiles
  const {
    error: profileError
  } = await supabase.from('user_profiles').insert([
    {
      id: userId,        // FK a auth.users.id
      email,
      nombre,
      carrera,
      telefono,
      fechaInicio,
      fechaTermino,
      horasTotales
    }
  ])

  // 3. Si falla crear perfil, eliminar usuario (rollback manual)
  if (profileError) {
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: 'Fallo al crear perfil, usuario eliminado', detalles: profileError }, { status: 500 })
  }

  // 4. Éxito 🎉
  return NextResponse.json({
    success: true,
    user_id: userId,
  })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const body = await req.json()
  const { userId } = body

  // Validar sesión actual
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (!user || sessionError) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // ⚠️ Podés validar que el user sea admin acá si hace falta

  // 1. Eliminar del Auth (requiere permisos elevados)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) {
    return NextResponse.json({ error: 'Fallo al eliminar usuario en Auth', detalles: authError }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente' })
}