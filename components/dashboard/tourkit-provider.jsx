'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function TourKitProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.TourKit?.startFor?.(pathname)
      } catch (_) {
        /* silent */
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
