'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CheckoutButton({ href, children, className, currentPlan, targetPlan }) {
  const router = useRouter()

  async function handleClick() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth?mode=signup&redirect=/pricing')
      return
    }

    if (currentPlan === targetPlan) return

    if (currentPlan === 'pro' && targetPlan === 'starter') return

    window.open(href, '_blank')
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
