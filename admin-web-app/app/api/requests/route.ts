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
    .from('requests')
    .select(`
      id, category, service_type, delivery_method, shopping_area,
      status, estimated_price, final_price, created_at, notes,
      customer:users!customer_id(id, name, phone),
      winga:wingas!winga_id(id, winga_id, users(name, phone))
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status !== 'all') query = query.eq('status', status)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}
