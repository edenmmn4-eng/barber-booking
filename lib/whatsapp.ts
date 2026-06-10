import { Appointment, Service } from '@/types'

const INSTANCE_ID = process.env.GREENAPI_ID_INSTANCE
const API_TOKEN = process.env.GREENAPI_API_TOKEN
const API_URL = `https://7107.api.greenapi.com`

function toWhatsAppId(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('972') ? digits : '972' + digits.replace(/^0/, '')
  return `${normalized}@c.us`
}

async function sendMessage(phone: string, message: string) {
  const chatId = toWhatsAppId(phone)
  const url = `${API_URL}/waInstance${INSTANCE_ID}/sendMessage/${API_TOKEN}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Green API error: ${err}`)
  }

  return res.json()
}

export async function sendBookingConfirmation(
  appointment: Appointment,
  service: Service,
  shopName: string,
  shopAddress: string | null
) {
  const date = new Date(appointment.appointment_date).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const message = `✅ התור שלך אושר!

👤 שלום ${appointment.client_name},
💈 שירות: ${service.name}
📅 תאריך: ${date}
🕐 שעה: ${appointment.appointment_time.slice(0, 5)}
${shopAddress ? `📍 כתובת: ${shopAddress}` : ''}

לביטול או שינוי, אנא צור קשר איתנו.
— ${shopName}`

  return sendMessage(appointment.client_phone, message)
}

export async function sendBookingReminder(
  appointment: Appointment,
  service: Service,
  shopName: string
) {
  const message = `⏰ תזכורת לתור מחר!

👤 שלום ${appointment.client_name},
💈 ${service.name}
🕐 שעה: ${appointment.appointment_time.slice(0, 5)}

מחכים לך! — ${shopName}`

  return sendMessage(appointment.client_phone, message)
}
