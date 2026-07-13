export type UserType = 'customer' | 'winga'

export interface User {
  id: string
  phone: string
  name: string | null
  user_type: UserType
  profile_image_url: string | null
  winga_id: string | null
  created_at: string
}

export interface Session {
  user: User
  access_token: string
}

export type LoginStep = 'entry' | 'otp' | 'name'
export type EntryTab  = 'phone' | 'wingaid'
