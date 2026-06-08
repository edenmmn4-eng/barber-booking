export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface Profile {
  id: string
  shop_name: string
  owner_name: string
  phone: string | null
  address: string | null
  logo_url: string | null
  timezone: string
  deposit_amount: number
  stripe_account_id: string | null
  whatsapp_number: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  shop_id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  deposit_amount: number
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface WorkingHours {
  id: string
  shop_id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
}

export interface AvailabilityOverride {
  id: string
  shop_id: string
  date: string
  is_closed: boolean
  open_time: string | null
  close_time: string | null
  reason: string | null
}

export interface Appointment {
  id: string
  shop_id: string
  service_id: string
  client_name: string
  client_phone: string
  client_email: string | null
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  payment_intent_id: string | null
  deposit_paid: number
  notes: string | null
  whatsapp_sent_at: string | null
  reminder_sent_at: string | null
  created_at: string
  updated_at: string
  service?: Service
}
