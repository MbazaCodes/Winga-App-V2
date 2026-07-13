import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

async function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('requests')
    .select(`id, category, service_type, delivery_method, meeting_point, shopping_area,
      notes, status, estimated_price, final_price, created_at,
      winga:wingas!winga_id(winga_id, badge, user:users!inner(name, phone, profile_image_url))`)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const PRICES: Record<string, number> = { hourly: 5000, half_day: 15000, full_day: 25000 }

  const { data, error } = await supabase.from('requests').insert({
    customer_id: user.id, category: body.category, service_type: body.serviceType,
    delivery_method: body.deliveryMethod, meeting_point: body.meetingPoint ?? '',
    shopping_area: body.area ?? '', notes: body.notes ?? null,
    status: 'searching', estimated_price: PRICES[body.serviceType] ?? 5000,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}