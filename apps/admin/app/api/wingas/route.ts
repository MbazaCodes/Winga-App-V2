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
  const badge  = url.searchParams.get('badge')  ?? 'all'
  const page   = parseInt(url.searchParams.get('page') ?? '1')
  const limit  = 10

  let query = supabase
    .from('wingas')
    .select(`
      id, winga_id, city, area, badge, rating, total_trips,
      is_online, profile_complete, national_id, completion_percentage,
      users!inner(id, name, phone, profile_image_url, created_at)
    `, { count: 'exact' })
    .order('is_online', { ascending: false })
    .order('rating', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (badge !== 'all') query = query.eq('badge', badge)
  if (search) query = query.ilike('users.name', `%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('winga_admin_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { wingaId, action, badge } = await req.json()

  if (action === 'assign_badge') {
    const { error } = await supabase.from('wingas').update({ badge }).eq('id', wingaId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (action === 'suspend') {
    const { error } = await supabase.from('users').update({ is_suspended: true })
      .eq('id', wingaId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
