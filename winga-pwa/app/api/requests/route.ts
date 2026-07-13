import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

async function getWingaId(userId: string) {
  const { data } = await supabase.from('wingas').select('id').eq('user_id', userId).single()
  return data?.id
}

async function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url    = new URL(req.url)
  const type   = url.searchParams.get('type') ?? 'available'
  const wingaId = await getWingaId(user.id)

  if (type === 'available') {
    // Open requests Winga can accept
    const { data, error } = await supabase
      .from('requests')
      .select(`id, category, service_type, delivery_method, shopping_area, notes,
        estimated_price, created_at, customer:users!customer_id(name, phone)`)
      .eq('status', 'searching')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data ?? [] })
  }

  if (type === 'mine' && wingaId) {
    const { data, error } = await supabase
      .from('requests')
      .select(`id, category, service_type, shopping_area, notes,
        estimated_price, final_price, status, created_at,
        customer:users!customer_id(name, phone)`)
      .eq('winga_id', wingaId)
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data ?? [] })
  }

  return NextResponse.json({ data: [] })
}

export async function PATCH(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { requestId, action } = await req.json()
  const wingaId = await getWingaId(user.id)
  if (!wingaId) return NextResponse.json({ error: 'Not a Winga' }, { status: 403 })

  const statusMap: Record<string, string> = {
    accept:   'accepted',
    shopping: 'shopping',
    complete: 'completed',
  }

  const newStatus = statusMap[action]
  if (!newStatus) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  const updateData: Record<string, unknown> = { status: newStatus }
  if (action === 'accept') updateData.winga_id = wingaId

  const { error } = await supabase.from('requests').update(updateData).eq('id', requestId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}