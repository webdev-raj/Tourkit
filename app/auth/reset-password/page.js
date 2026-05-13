'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message || 'Could not update password.')
        setLoading(false)
        return
      }
      router.replace('/dashboard?passwordUpdated=1')
    } catch (err) {
      setError(String(err?.message || 'Something went wrong.'))
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 tk-grid opacity-[0.28]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-glow-soft" aria-hidden />

      <main
        id="main-content"
        className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col lg:flex-row"
        tabIndex={-1}>
        <aside className="relative flex flex-col justify-between gap-10 border-b border-border/60 px-6 py-10 lg:w-[42%] lg:border-b-0 lg:border-r lg:border-border/60 lg:py-14">
          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent lg:block" aria-hidden />

          <div className="flex flex-col gap-8">
            <Button variant="ghost" className="w-fit px-0 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/">← Back to TourKit</Link>
            </Button>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Security</p>
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Set a new password
              </h1>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                Choose a strong password you have not used elsewhere. After updating, you will continue to your
                dashboard.
              </p>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            If you did not request a reset, you can ignore this page and your existing password stays unchanged until you
            submit a new one here.
          </p>
        </aside>

        <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 lg:px-10 lg:py-14">
          <div className="flex w-full max-w-md flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Account
              </p>
            </div>

            <Card className="w-full max-w-md border-border/80 bg-card/80 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)] backdrop-blur-sm">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle>Set new password</CardTitle>
                <CardDescription>Enter your new password below.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {error ? (
                    <Alert variant="destructive" aria-live="polite" role="alert">
                      <AlertTitle>Could not update password</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-password">New password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className="pe-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className="pe-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        aria-pressed={showConfirm}
                        onClick={() => setShowConfirm((v) => !v)}>
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Updating…' : 'Update password'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-muted-foreground">Wrong place?</span>
                <Link
                  className="text-sm font-medium text-primary underline-offset-4 hover:text-primary/90 hover:underline"
                  href="/auth">
                  Return to sign in
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
