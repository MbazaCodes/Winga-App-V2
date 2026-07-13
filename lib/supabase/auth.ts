import { supabase } from './client'
import { User } from '@/types/auth'

export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({ phone: `+255${phone}` })
    return { error: error?.message ?? null }
  } catch {
    return { error: 'Hitilafu ya mtandao. Jaribu tena.' }
  }
}

export async function verifyOTP(phone: string, token: string): Promise<{
  user: User | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+255${phone}`,
      token,
      type: 'sms',
    })
    if (error) return { user: null, error: 'Nambari ya siri si sahihi.' }

    // Fetch user profile
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

export async function lookupWingaById(wingaId: string): Promise<{
  phone: string | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase.rpc('lookup_winga_by_id', { winga_id: wingaId })
    if (error || !data) return { phone: null, error: 'Winga ID haikupatikana.' }
    return { phone: data.phone, error: null }
  } catch {
    return { phone: null, error: 'Hitilafu ya mtandao.' }
  }
}

export async function saveName(userId: string, name: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('users').update({ name }).eq('id', userId)
    return { error: error?.message ?? null }
  } catch {
    return { error: 'Hitilafu ya kuhifadhi jina.' }
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
