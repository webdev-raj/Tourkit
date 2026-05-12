'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function formatError(error) {
  return String(error?.message ?? '') || 'Something went wrong.'
}

export async function updateDisplayName(displayName) {
  const name = String(displayName ?? '').trim()

  if (!name) return { ok: false, error: 'Display name is required.' }
  if (name.length > 50) return { ok: false, error: 'Display name must be 50 characters or less.' }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    data: { display_name: name },
  })

  if (error) return { ok: false, error: formatError(error) }
  return { ok: true }
}

export async function updateDisplayNameAction(prevState, formData) {
  try {
    const displayName = String(formData?.get?.('display_name') ?? '')
    return await updateDisplayName(displayName)
  } catch (e) {
    return { ok: false, error: formatError(e) }
  }
}

export async function sendPasswordReset() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.email) return { ok: false, error: 'You must be signed in.' }

  const base = String(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
  const redirectTo = `${base}/auth/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo,
  })

  if (error) return { ok: false, error: formatError(error) }
  return { ok: true }
}

export async function sendPasswordResetAction() {
  try {
    return await sendPasswordReset()
  } catch (e) {
    return { ok: false, error: formatError(e) }
  }
}

export async function deleteAccount() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return { ok: false, error: 'You must be signed in.' }

  const { error: deleteProjectsError } = await supabase.from('projects').delete().eq('user_id', user.id)
  if (deleteProjectsError) return { ok: false, error: formatError(deleteProjectsError) }

  try {
    const admin = createAdminClient()
    const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteUserError) return { ok: false, error: formatError(deleteUserError) }
  } catch (e) {
    return { ok: false, error: formatError(e) }
  }

  return { ok: true }
}

export async function deleteAccountAction() {
  try {
    return await deleteAccount()
  } catch (e) {
    return { ok: false, error: formatError(e) }
  }
}

