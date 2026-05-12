import crypto from 'crypto'

import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

function resolvePlanFromName(name) {
  const normalized = String(name || '').toLowerCase()
  if (normalized.includes('pro')) return 'pro'
  if (normalized.includes('starter')) return 'starter'
  return 'starter'
}

async function findUserByEmail(adminSupabase, customerEmail) {
  if (!customerEmail) return null
  try {
    const { data } = await adminSupabase.auth.admin.listUsers()
    const users = data?.users || []

    console.log('Total users found:', users?.length)
    console.log('Looking for email:', customerEmail)
    console.log(
      'Available emails:',
      users?.map((u) => u.email)
    )

    const user =
      users.find((u) => String(u.email || '').toLowerCase() === String(customerEmail).toLowerCase()) || null

    console.log('User match:', user?.email)

    return user
  } catch (_) {
    return null
  }
}

export async function POST(req) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature')
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    if (!secret) return new Response('OK', { status: 200 })

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(rawBody)
    const digest = hmac.digest('hex')

    // Always return 200 (avoid webhook retries), but ignore invalid signatures.
    if (!signature || signature !== digest) return new Response('OK', { status: 200 })

    const payload = JSON.parse(rawBody)
    const eventName = payload?.meta?.event_name
    const customerId = payload?.data?.attributes?.customer_id?.toString?.() || null
    const subscriptionId = payload?.data?.id?.toString?.() || null
    const customerEmail =
      payload?.data?.attributes?.user_email ||
      payload?.data?.attributes?.customer_email ||
      payload?.meta?.custom_data?.email ||
      null
    const status = payload?.data?.attributes?.status || 'inactive'

    console.log('Full payload attributes:', JSON.stringify(payload?.data?.attributes, null, 2))

    const adminSupabase = createAdminClient()
    const user = await findUserByEmail(adminSupabase, customerEmail)

    if (!user?.id) return new Response('OK', { status: 200 })

    if (eventName === 'subscription_created') {
      const productName = payload?.data?.attributes?.product_name || ''
      const plan = resolvePlanFromName(productName)
      await adminSupabase.from('user_plans').upsert(
        {
          user_id: user.id,
          plan,
          lemon_squeezy_customer_id: customerId,
          lemon_squeezy_subscription_id: subscriptionId,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
    }

    if (eventName === 'subscription_updated') {
      const productName = payload?.data?.attributes?.product_name || ''
      const plan = resolvePlanFromName(productName)
      await adminSupabase.from('user_plans').upsert(
        {
          user_id: user.id,
          plan: status === 'active' ? plan : 'free',
          lemon_squeezy_customer_id: customerId,
          lemon_squeezy_subscription_id: subscriptionId,
          subscription_status: status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
    }

    if (eventName === 'subscription_cancelled') {
      await adminSupabase
        .from('user_plans')
        .update({
          plan: 'free',
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
    }

    if (eventName === 'order_created') {
      const productName = payload?.data?.attributes?.first_order_item?.product_name || ''
      const plan = resolvePlanFromName(productName)
      await adminSupabase.from('user_plans').upsert(
        {
          user_id: user.id,
          plan,
          lemon_squeezy_customer_id: customerId,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
    }
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error)
  }

  return new Response('OK', { status: 200 })
}
