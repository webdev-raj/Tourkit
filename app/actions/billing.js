'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function getUserPlan() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { plan: 'free', status: 'inactive' }

  const { data } = await supabase
    .from('user_plans')
    .select('plan, subscription_status')
    .eq('user_id', user.id)
    .maybeSingle()

  return {
    plan: data?.plan || 'free',
    status: data?.subscription_status || 'inactive',
  }
}

export async function getOrCreateUserPlan(userId) {
  const adminSupabase = createAdminClient()

  const { data: existing } = await adminSupabase
    .from('user_plans')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) return existing

  const { data } = await adminSupabase
    .from('user_plans')
    .insert({ user_id: userId, plan: 'free' })
    .select()
    .single()

  return data
}
