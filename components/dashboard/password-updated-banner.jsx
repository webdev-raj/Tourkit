'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function BannerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('passwordUpdated') === '1') setVisible(true)
  }, [searchParams])

  if (!visible) return null

  return (
    <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>Password updated!</span>
        <button
          type="button"
          className="text-xs font-medium underline underline-offset-4 hover:text-white"
          onClick={() => {
            setVisible(false)
            router.replace('/dashboard')
          }}>
          Dismiss
        </button>
      </div>
    </div>
  )
}

export function PasswordUpdatedBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  )
}
