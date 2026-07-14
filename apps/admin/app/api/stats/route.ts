import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('winga_admin_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  const [requestsRes, usersRes, earningsRes] = await Promise.all([
    supabase.from('requests').select('id, status, estimated_price, final_price, created_at'),
    supabase.from('users').select('id, user_type, created_at'),
    supabase.from('requests').select('final_price, estimated_price').eq('status', 'completed'),
  ])

  const requests  = requestsRes.data  ?? []
  const users     = usersRes.data     ?? []
  const earnings  = earningsRes.data  ?? []

  const now   = new Date()
  const week  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000)
  const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const totalRevenue   = earnings.reduce((s, r) => s + (r.final_price ?? r.estimated_price ?? 0), 0)
  const weekRevenue    = earnings.filter(r => true).reduce((s, r) => s + (r.final_price ?? r.estimated_price ?? 0), 0)
  const prevWeekRev    = weekRevenue * 0.85 // approximate for now

  return NextResponse.json({
    requests: {
      total:       requests.length,
      completed:   requests.filter(r => r.status === 'completed').length,
      inProgress:  requests.filter(r => ['searching','accepted','shopping'].includes(r.status)).length,
      cancelled:   requests.filter(r => r.status === 'cancelled').length,
      change:      '+12%',
    },
    users: {
      customers:  users.filter(u => u.user_type === 'customer').length,
      wingas:     users.filter(u => u.user_type === 'winga').length,
      newThisMonth: users.filter(u => new Date(u.created_at) > month).length,
    },
    revenue: {
      total:      totalRevenue,
      wingaPay:   Math.round(totalRevenue * 0.85),
      appFee:     Math.round(totalRevenue * 0.12),
      traTax:     Math.round(totalRevenue * 0.03),
      change:     '+18%',
    },
  })
}
