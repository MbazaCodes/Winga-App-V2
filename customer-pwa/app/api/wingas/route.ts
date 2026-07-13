import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export async function GET(req: NextRequest) {
  const url    = new URL(req.url)
  const search = url.searchParams.get('search') ?? ''
  const cat    = url.searchParams.get('category') ?? ''

  let query = supabase
    .from('wingas')
    .select(`id, winga_id, city, area, badge, rating, total_trips, is_online, profile_complete, specialties,
      user:users!inner(id, name, phone, profile_image_url)`)
    .eq('profile_complete', true)
    .order('is_online', { ascending: false })
    .order('rating',    { ascending: false })
    .limit(20)

  if (search) query = query.ilike('users.name', '%' + search + '%')

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}