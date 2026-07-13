export type BadgeType = 'starter' | 'mid' | 'verified'
export type RequestStatus = 'searching' | 'accepted' | 'shopping' | 'completed' | 'cancelled'
export type ServiceType = 'hourly' | 'half_day' | 'full_day'
export type DeliveryMethod = 'with_customer' | 'delivery' | 'pickup'

export interface Winga {
  id: string
  name: string
  phone: string
  city: string
  area: string
  bio: string | null
  badge: BadgeType
  rating: number
  total_trips: number
  is_online: boolean
  profile_image_url: string | null
  specialties: string[]
}

export interface Request {
  id: string
  customer_id: string
  winga_id: string | null
  category: string
  service_type: ServiceType
  delivery_method: DeliveryMethod
  meeting_point: string
  shopping_area: string
  notes: string | null
  status: RequestStatus
  estimated_price: number | null
  final_price: number | null
  created_at: string
  winga?: Winga
}

export interface Message {
  id: string
  request_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

export interface Conversation {
  request_id: string
  winga: Winga
  last_message: string | null
  last_message_at: string | null
  unread_count: number
}
