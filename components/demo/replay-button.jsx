'use client'

import { RotateCcw } from 'lucide-react'

export default function ReplayButton({ scriptKey }) {
  function handleReplay() {
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith('tourkit_seen_' + scriptKey)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      /* silent */
    }
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={handleReplay}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-transparent px-3 text-xs font-medium text-gray-200 transition hover:bg-white/10">
      <RotateCcw size={14} />
      Replay tour
    </button>
  )
}
