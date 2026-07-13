import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useSession() {
  const { user, loadSession } = useAuthStore()

  useEffect(() => {
    if (!user) loadSession()
  }, [])

  return { user }
}
