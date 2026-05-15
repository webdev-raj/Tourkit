import Link from 'next/link'
import Script from 'next/script'
import { Poppins } from 'next/font/google'

import DemoSubnav from '@/components/demo/demo-subnav'
import ReplayButton from '@/components/demo/replay-button'

import './demo.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export async function generateMetadata({ params }) {
  const { scriptKey } = await params
  return {
    title: `Live Demo — ${scriptKey}`,
    description: 'Multi-page sandbox to test your tour and URL-based triggers',
  }
}

export default async function DemoLayout({ children, params }) {
  const { scriptKey } = await params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  return (
    <div className={`${poppins.className} demo-root antialiased`}>
      <div className="fixed inset-x-0 top-0 z-[999] h-12 border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#F15025]" aria-hidden />
            <span className="text-sm font-bold text-white">TourKit</span>
            <span className="rounded-full border border-[#F15025]/50 bg-[#F15025]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#F15025]">
              Live Demo
            </span>
          </div>
          <p className="hidden text-xs text-gray-400 md:block">Sandbox page to test your tour</p>
          <div className="flex items-center gap-2">
            <ReplayButton scriptKey={scriptKey} />
            <Link
              href="/dashboard"
              className="inline-flex h-8 items-center rounded-md bg-[#F15025] px-3 text-xs font-semibold text-white transition hover:brightness-110">
              Open dashboard
            </Link>
          </div>
        </div>
      </div>

      <DemoSubnav scriptKey={scriptKey} />

      <div className="demo-content-shell">{children}</div>

      <Script
        id="tourkit-demo-flag"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: 'window.__TOURKIT_DEMO__ = true;',
        }}
      />
      <Script
        id="tourkit-sdk"
        src="/tourkit.min.js"
        data-key={scriptKey}
        data-api={appUrl}
        data-demo="true"
        strategy="afterInteractive"
      />
    </div>
  )
}
