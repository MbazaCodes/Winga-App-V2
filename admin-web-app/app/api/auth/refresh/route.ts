import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const token = req.cookies.get('winga_admin_session')?.value
  if (!token) return NextResponse.json({ error: 'No session' }, { status: 401 })
  return NextResponse.json({ success: true })
}
