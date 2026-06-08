import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export function formatPrice(amountInCents: number, currency = 'ils'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100)
}
