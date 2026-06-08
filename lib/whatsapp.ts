import twilio from 'twilio'
import { Appointment, Service } from '@/types'

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
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

  return getClient().messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${appointment.client_phone}`,
    body: message,
  })
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

  return getClient().messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${appointment.client_phone}`,
    body: message,
  })
}
