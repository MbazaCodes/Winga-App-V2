import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('winga_admin_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  const url    = new URL(req.url)
  const period = url.searchParams.get('period') ?? 'month'

  const now   = new Date()
  let from    = new Date(0)
  if (period === 'today') from = new Date(now.setHours(0,0,0,0))
  if (period === 'week')  from = new Date(Date.now() - 7  * 86400000)
  if (period === 'month') from = new Date(Date.now() - 30 * 86400000)

  const { data, error } = await supabase
    .from('requests')
    .select(`
      id, final_price, estimated_price, created_at,
      customer:users!customer_id(name),
      winga:wingas!winga_id(winga_id, users(name))
    `)
    .eq('status', 'completed')
    .gte('created_at', from.toISOString())
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows    = data ?? []
  const gross   = rows.reduce((s, r) => s + (r.final_price ?? r.estimated_price ?? 0), 0)

  return NextResponse.json({
    transactions: rows,
    summary: {
      gross,
      net:  Math.round(gross * 0.85),
      fee:  Math.round(gross * 0.12),
      tax:  Math.round(gross * 0.03),
      count: rows.length,
    },
  })
}
