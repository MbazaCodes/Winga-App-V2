import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  try {
    const { email, password } = await req.json()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) {
      return NextResponse.json({ error: 'Barua pepe au nenosiri si sahihi' }, { status: 401 })
    }
    const { data: adminRow } = await supabase
      .from('admins').select('id,role,name').eq('user_id', data.user.id).eq('is_active', true).single()
    if (!adminRow) {
      return NextResponse.json({ error: 'Huna ruhusa ya kuingia hapa' }, { status: 403 })
    }
    const res = NextResponse.json({ success: true, admin: adminRow })
    res.cookies.set('winga_admin_session', data.session!.access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60 * 60 * 24, path: '/',
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Hitilafu ya seva' }, { status: 500 })
  }
}
