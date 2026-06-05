'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function SubmitButton({ children }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {children}
    </Button>
  )
}

export function AuthForm({ mode, action, redirectPath = '/dashboard', loginHref, signupHref }) {
  const [state, formAction] = useActionState(action, { error: null, message: null })
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLogin = mode === 'login'

  useEffect(() => {
    setShowPassword(false)
    setError(null)
  }, [mode])

  async function handleGoogleSignIn() {
    try {
      setGoogleLoading(true)
      setError(null)
      const supabase = createClient()

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      })

      if (oauthError) {
        setError(oauthError.message)
      }
    } catch (e) {
      setError('Something went wrong')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border/80 bg-card/80 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)] backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{isLogin ? 'Welcome back' : 'Create your account'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Sign in to manage projects and publish tours.'
            : 'Start generating onboarding tours for any website.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {error || state?.error ? (
          <Alert variant="destructive" aria-live="polite">
            <AlertTitle>Couldn’t {isLogin ? 'sign in' : 'sign up'}</AlertTitle>
            <AlertDescription>{error || state.error}</AlertDescription>
          </Alert>
        ) : null}

        {state?.message ? (
          <Alert aria-live="polite">
            <AlertTitle>One more step</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        ) : null}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px 16px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            opacity: googleLoading ? 0.7 : 1,
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
            marginBottom: '16px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}>
          {!googleLoading ? (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
              <path
                fill="#EA4335"
                d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
              />
            </svg>
          ) : null}
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <span
            style={{
              color: '#555',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}>
            or continue with email
          </span>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="redirect" value={redirectPath} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com…"
              autoComplete="email"
              spellCheck={false}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? '••••••••…' : 'At least 8 characters…'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                spellCheck={false}
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
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
          </div>
          <SubmitButton>{isLogin ? 'Sign in' : 'Create account'}</SubmitButton>
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
        </span>
        <Link
          className="text-sm font-medium text-primary underline-offset-4 hover:text-primary/90 hover:underline"
          href={isLogin ? signupHref : loginHref}
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </Link>
      </CardFooter>
    </Card>
  )
}

