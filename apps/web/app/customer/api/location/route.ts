import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

// Customer fetches Winga location for their active request
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const requestId = new URL(req.url).searchParams.get('requestId')
  if (!requestId) return NextResponse.json({ error: 'requestId required' }, { status: 400 })

  // Get all online Wingas for home screen (no requestId)
  const { data, error } = await supabase
    .from('winga_locations')
    .select(`
      user_id, lat, lng, heading, speed, updated_at,
      winga:wingas!inner(
        id, winga_id, badge, rating,
        user:users!inner(name, profile_image_url)
      )
    `)
    .eq('request_id', requestId)
    .gte('updated_at', new Date(Date.now() - 60000).toISOString()) // active in last 60s

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

// Get all online Wingas for home map view
export async function POST(req: NextRequest) {
  const { lat, lng, radius = 5000 } = await req.json() // radius in meters

  const { data, error } = await supabase
    .from('winga_locations')
    .select(`
      user_id, lat, lng, updated_at,
      winga:wingas!inner(
        id, badge, rating, is_online,
        user:users!inner(name, profile_image_url)
      )
    `)
    .gte('updated_at', new Date(Date.now() - 300000).toISOString()) // active in last 5 mins

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
