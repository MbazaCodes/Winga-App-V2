import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function GET(req: NextRequest) {
  const token = req.cookies.get('winga_admin_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url    = new URL(req.url)
  const search = url.searchParams.get('search') ?? ''
  const status = url.searchParams.get('status') ?? 'all'
  const page   = parseInt(url.searchParams.get('page') ?? '1')
  const limit  = 10

  let query = supabase
    .from('users')
    .select('id, name, phone, created_at, is_banned, profile_image_url', { count: 'exact' })
    .eq('user_type', 'customer')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
  if (status === 'banned') query = query.eq('is_banned', true)
  if (status === 'active') query = query.eq('is_banned', false)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('winga_admin_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId, action } = await req.json()
  const { error } = await supabase.from('users')
    .update({ is_banned: action === 'ban' }).eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
