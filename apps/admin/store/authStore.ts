import { create } from 'zustand'
import { User, LoginStep, EntryTab } from '@/types/auth'
import { storage } from '@/lib/utils/storage'

interface AuthStore {
  user: User | null
  step: LoginStep
  activeTab: EntryTab
  phone: string
  wingaId: string

  setUser: (user: User | null) => void
  setStep: (step: LoginStep) => void
  setActiveTab: (tab: EntryTab) => void
  setPhone: (phone: string) => void
  setWingaId: (id: string) => void
  clearAuth: () => void
  loadSession: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  step: 'entry',
  activeTab: 'phone',
  phone: '',
  wingaId: '',

  setUser: (user) => {
    set({ user })
    if (user) storage.set('winga_user', JSON.stringify(user))
    else storage.remove('winga_user')
  },
  setStep: (step) => set({ step }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setPhone: (phone) => set({ phone }),
  setWingaId: (wingaId) => set({ wingaId }),
  clearAuth: () => {
    storage.remove('winga_user')
    storage.remove('winga_onboarded')
    set({ user: null, step: 'entry', phone: '', wingaId: '' })
  },
  loadSession: () => {
    const raw = storage.get('winga_user')
    if (raw) {
      try { set({ user: JSON.parse(raw) }) } catch {}
    }
  },
}))
