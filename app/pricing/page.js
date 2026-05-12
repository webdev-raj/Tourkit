import Link from 'next/link'
import { CheckIcon, XIcon } from 'lucide-react'

import { getUserPlan } from '@/app/actions/billing'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Pricing — TourKit',
}

const plans = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    period: '/ month',
    description: 'Perfect for trying TourKit',
    cta: 'Get started free',
    href: '/auth?mode=signup',
    external: false,
    primary: false,
    features: [
      { ok: true, text: '1 project' },
      { ok: true, text: '500 tour sessions/month' },
      { ok: true, text: 'Basic analytics' },
      { ok: true, text: 'All tooltip customization' },
      { ok: false, text: 'TourKit branding on tooltip' },
      { ok: false, text: 'Priority support' },
    ],
  },
  {
    key: 'starter',
    name: 'Starter',
    price: '$9',
    period: '/ month',
    description: 'For freelancers and small projects',
    cta: 'Get Starter',
    href: process.env.NEXT_PUBLIC_STARTER_CHECKOUT_URL || '#',
    external: true,
    primary: true,
    features: [
      { ok: true, text: '3 projects' },
      { ok: true, text: '2,000 tour sessions/month' },
      { ok: true, text: 'Full analytics dashboard' },
      { ok: true, text: 'All tooltip customization' },
      { ok: true, text: 'No TourKit branding' },
      { ok: true, text: 'Email support' },
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/ month',
    description: 'For growing teams and agencies',
    cta: 'Get Pro',
    href: process.env.NEXT_PUBLIC_PRO_CHECKOUT_URL || '#',
    external: true,
    primary: false,
    features: [
      { ok: true, text: 'Unlimited projects' },
      { ok: true, text: 'Unlimited sessions' },
      { ok: true, text: 'Full analytics dashboard' },
      { ok: true, text: 'All tooltip customization' },
      { ok: true, text: 'No TourKit branding' },
      { ok: true, text: 'Priority support' },
      { ok: true, text: 'Early access to new features' },
    ],
  },
]

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { plan } = await getUserPlan()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-white/10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-[#F15025]" aria-hidden />
            TourKit
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pb-20 pt-14 sm:px-6">
        <section className="space-y-4 text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
          <p className="text-base text-muted-foreground sm:text-lg">Start free. Upgrade when you need more.</p>
          {user ? (
            <div className="inline-flex rounded-full border border-white/10 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              Current plan: <span className="ml-1 font-semibold capitalize text-foreground">{plan}</span>
            </div>
          ) : null}
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {plans.map((item) => (
            <article
              key={item.key}
              className={`rounded-xl border bg-[#111111] p-8 ${
                item.primary ? 'scale-[1.01] border-[#F15025]/50 shadow-[0_16px_40px_-24px_rgba(241,80,37,0.55)]' : 'border-white/10'
              }`}>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                {item.primary ? (
                  <span className="rounded-full bg-[#F15025] px-2.5 py-1 text-[11px] font-semibold text-white">Most popular</span>
                ) : null}
              </div>

              <div className="mb-2 flex items-end gap-2">
                <span className="text-4xl font-bold leading-none">{item.price}</span>
                <span className="text-lg text-muted-foreground">{item.period}</span>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{item.description}</p>

              <ul className="mb-8 space-y-2.5">
                {item.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-2.5 text-sm">
                    {feature.ok ? (
                      <CheckIcon className="size-4 shrink-0 text-emerald-400" aria-hidden />
                    ) : (
                      <XIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    )}
                    <span className={feature.ok ? 'text-foreground' : 'text-muted-foreground'}>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full" variant={item.primary ? 'default' : 'outline'}>
                <Link
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer noopener' : undefined}
                  className={item.primary ? 'bg-[#F15025] hover:bg-[#F15025]/90' : ''}>
                  {item.cta}
                </Link>
              </Button>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-white/10 bg-card/20 p-8">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="space-y-5 text-sm">
            <div>
              <h3 className="font-medium text-foreground">Can I cancel anytime?</h3>
              <p className="mt-1 text-muted-foreground">Yes. Cancel from your dashboard anytime. No questions asked.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">What happens when I hit the session limit?</h3>
              <p className="mt-1 text-muted-foreground">Tours stop showing until next month. Upgrade anytime to increase limits.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Do you offer refunds?</h3>
              <p className="mt-1 text-muted-foreground">Yes, we offer a 7-day money back guarantee on all paid plans.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-7">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} TourKit</span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
