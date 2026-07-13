import { useState, useCallback } from 'react'
import { sendOTP, verifyOTP } from '@/lib/supabase/auth'
import { User } from '@/types/auth'

export function useOTP() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(async (phone: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    const { error } = await sendOTP(phone)
    setIsLoading(false)
    if (error) { setError(error); return false }
    return true
  }, [])

  const verify = useCallback(async (phone: string, code: string): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    const { user, error } = await verifyOTP(phone, code)
    setIsLoading(false)
    if (error) { setError(error); return null }
    return user
  }, [])

  return { send, verify, isLoading, error, setError }
}
