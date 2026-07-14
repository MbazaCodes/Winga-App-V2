import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: winga } = await supabase.from('wingas').select('id').eq('user_id', user.id).single()
  if (!winga) return NextResponse.json({ error: 'Not a Winga' }, { status: 403 })

  const period = new URL(req.url).searchParams.get('period') ?? 'month'
  let from = new Date(0)
  if (period === 'today') from = new Date(new Date().setHours(0,0,0,0))
  if (period === 'week')  from = new Date(Date.now() - 7  * 86400000)
  if (period === 'month') from = new Date(Date.now() - 30 * 86400000)

  const { data, error } = await supabase
    .from('requests')
    .select('id, final_price, estimated_price, created_at, customer:users!customer_id(name)')
    .eq('winga_id', winga.id)
    .eq('status', 'completed')
    .gte('created_at', from.toISOString())
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows  = data ?? []
  const gross = rows.reduce((s, r) => s + (r.final_price ?? r.estimated_price ?? 0), 0)

  return NextResponse.json({
    trips: rows,
    summary: {
      gross, count: rows.length,
      net:  Math.round(gross * 0.85),
      fee:  Math.round(gross * 0.12),
      tax:  Math.round(gross * 0.03),
    },
  })
}