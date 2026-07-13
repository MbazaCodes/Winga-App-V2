import { supabase } from './client'
import { User } from '@/types/auth'
import { storage } from '@/lib/utils/storage'

// ─── DEMO MODE ───────────────────────────────────────────────────────────────
// When Supabase is not configured, use mock auth.
// OTP is always 123456 for any phone number.
// Replace with real Supabase calls once credentials are set.
// ─────────────────────────────────────────────────────────────────────────────

const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

function mockUser(phone: string): User {
  return {
    id: `demo-${phone}`,
    phone,
    name: null,
    user_type: 'customer',
    profile_image_url: null,
    winga_id: null,
    created_at: new Date().toISOString(),
  }
}

// ─── sendOTP ─────────────────────────────────────────────────────────────────
export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  if (IS_DEMO) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))
    // Store phone so verify knows which user to create
    storage.set('winga_otp_phone', phone)
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({ phone: `+255${phone}` })
    return { error: error?.message ?? null }
  } catch {
    return { error: 'Hitilafu ya mtandao. Jaribu tena.' }
  }
}

// ─── verifyOTP ───────────────────────────────────────────────────────────────
export async function verifyOTP(phone: string, token: string): Promise<{
  user: User | null
  error: string | null
}> {
  if (IS_DEMO) {
    await new Promise(r => setTimeout(r, 800))
    if (token !== '123456') {
      return { user: null, error: 'Nambari ya siri si sahihi. Tumia 123456.' }
    }
    const user = mockUser(phone)
    return { user, error: null }
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+255${phone}`,
      token,
      type: 'sms',
    })
    if (error) return { user: null, error: 'Nambari ya siri si sahihi.' }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user!.id)
      .single()

    return { user: profile as User, error: null }
  } catch {
    return { user: null, error: 'Hitilafu ya mtandao. Jaribu tena.' }
  }
}

// ─── lookupWingaById ─────────────────────────────────────────────────────────
export async function lookupWingaById(wingaId: string): Promise<{
  phone: string | null
  error: string | null
}> {
  if (IS_DEMO) {
    await new Promise(r => setTimeout(r, 600))
    if (wingaId === 'WNGA10001') return { phone: '685006000', error: null }
    return { phone: null, error: 'Winga ID haikupatikana.' }
  }

  try {
    const { data, error } = await supabase.rpc('lookup_winga_by_id', { winga_id: wingaId })
    if (error || !data) return { phone: null, error: 'Winga ID haikupatikana.' }
    return { phone: data.phone, error: null }
  } catch {
    return { phone: null, error: 'Hitilafu ya mtandao.' }
  }
}

// ─── saveName ────────────────────────────────────────────────────────────────
export async function saveName(userId: string, name: string): Promise<{ error: string | null }> {
  if (IS_DEMO) {
    await new Promise(r => setTimeout(r, 400))
    return { error: null }
  }

  try {
    const { error } = await supabase.from('users').update({ name }).eq('id', userId)
    return { error: error?.message ?? null }
  } catch {
    return { error: 'Hitilafu ya kuhifadhi jina.' }
  }
}

// ─── signOut ─────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  if (!IS_DEMO) {
    try { await supabase.auth.signOut() } catch {}
  }
}
