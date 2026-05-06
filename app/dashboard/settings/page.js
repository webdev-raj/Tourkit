"use client"

import { useEffect, useMemo, useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon, CheckIcon, CodeIcon, CopyIcon, PencilIcon, UserIcon } from "lucide-react"

import { deleteAccountAction, sendPasswordResetAction, updateDisplayNameAction } from "@/app/actions/settings"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CDN_URL =
  "https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@main/sdk/dist/tourkit.min.js"

function CodeBlock({ code }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#050505] p-4 text-[11px] text-[#e6e8e6]">
      <code className="whitespace-pre">{code}</code>
    </pre>
  )
}

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      /* silent */
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-xl border-white/10 bg-background/20 hover:bg-muted/20"
      onClick={onCopy}>
      {copied ? <CheckIcon className="mr-2 size-4 text-primary" /> : <CopyIcon className="mr-2 size-4" />}
      {copied ? "Copied" : label}
    </Button>
  )
}

function SubmitButton({ children }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="rounded-xl">
      {pending ? "Saving…" : children}
    </Button>
  )
}

function ActionButton({ children }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="outline" disabled={pending} className="rounded-xl border-white/10 bg-background/20 hover:bg-muted/20">
      {pending ? "Sending…" : children}
    </Button>
  )
}

export default function SettingsPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (cancelled) return
        const user = data?.user
        setEmail(user?.email ?? "")
        setDisplayName(user?.user_metadata?.display_name ?? "")
      } catch {
        if (!cancelled) {
          setEmail("")
          setDisplayName("")
        }
      }
    }

    loadUser()

    return () => {
      cancelled = true
    }
  }, [])

  const exampleSnippet = useMemo(() => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `<script
  src=\"${CDN_URL}\"
  data-key=\"YOUR_SCRIPT_KEY\"
  data-api=\"${appUrl}\"
  async>
</script>`
  }, [])

  const [profileState, profileAction] = useActionState(updateDisplayNameAction, { ok: false, error: null })
  const [resetState, resetAction] = useActionState(sendPasswordResetAction, { ok: false, error: null })
  const [deleteState, deleteAction] = useActionState(deleteAccountAction, { ok: false, error: null })

  useEffect(() => {
    if (deleteState?.ok) {
      router.push("/auth")
      router.refresh()
    }
  }, [deleteState, router])

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <Card className="rounded-xl border border-white/10 bg-card/20">
            <CardHeader className="px-6">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="size-4 text-primary" aria-hidden />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label>Email address</Label>
                  <Input value={email} readOnly disabled className="rounded-xl border-white/10 bg-background/20" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">Send a password reset link to your email</p>

                  <form action={resetAction} className="flex flex-col gap-3">
                    <ActionButton>Send reset link</ActionButton>

                    {resetState?.ok ? (
                      <Alert className="border-white/10 bg-background/10">
                        <AlertTitle>Reset link sent!</AlertTitle>
                        <AlertDescription>Check your email.</AlertDescription>
                      </Alert>
                    ) : null}

                    {resetState?.error ? (
                      <Alert variant="destructive" className="border-white/10">
                        <AlertTitle>Couldn’t send reset link</AlertTitle>
                        <AlertDescription>{resetState.error}</AlertDescription>
                      </Alert>
                    ) : null}
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-white/10 bg-card/20">
            <CardHeader className="px-6">
              <CardTitle className="flex items-center gap-2">
                <PencilIcon className="size-4 text-primary" aria-hidden />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <form
                action={profileAction}
                className="flex flex-col gap-4"
                onSubmit={() => {
                  /* keep useActionState as source of truth */
                }}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="display_name">Display name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    placeholder="Your name"
                    defaultValue={displayName}
                    className="rounded-xl border-white/10 bg-background/20"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <SubmitButton>Save changes</SubmitButton>
                </div>

                {profileState?.ok ? (
                  <Alert className="border-white/10 bg-background/10">
                    <AlertTitle>Display name updated!</AlertTitle>
                    <AlertDescription>Your profile has been saved.</AlertDescription>
                  </Alert>
                ) : null}

                {profileState?.error ? (
                  <Alert variant="destructive" className="border-white/10">
                    <AlertTitle>Couldn’t update display name</AlertTitle>
                    <AlertDescription>{profileState.error}</AlertDescription>
                  </Alert>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-white/10 bg-card/20">
            <CardHeader className="px-6">
              <CardTitle className="flex items-center gap-2">
                <CodeIcon className="size-4 text-primary" aria-hidden />
                SDK &amp; Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label>CDN URL</Label>
                  <div className="flex items-center gap-2">
                    <Input value={CDN_URL} readOnly className="rounded-xl border-white/10 bg-background/20" />
                    <CopyButton value={CDN_URL} label="Copy" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>How to install</Label>
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>Create a project and copy your script key</li>
                    <li>Add the script tag before &lt;/body&gt; on your website</li>
                    <li>Configure your tour steps from the dashboard</li>
                  </ol>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Label>Example snippet</Label>
                    <CopyButton value={exampleSnippet} label="Copy snippet" />
                  </div>
                  <CodeBlock code={exampleSnippet} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
          <Card className="rounded-xl border border-red-900/70 bg-card/20">
            <CardHeader className="px-6">
              <CardTitle className="flex items-center gap-2 text-red-300">
                <AlertTriangleIcon className="size-4 text-red-300" aria-hidden />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-foreground">Delete account</div>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account, all projects, tours, steps, and analytics data. This action cannot be undone.
                  </p>
                </div>

                {deleteState?.error ? (
                  <Alert variant="destructive" className="border-red-900/60">
                    <AlertTitle>Couldn’t delete account</AlertTitle>
                    <AlertDescription>{deleteState.error}</AlertDescription>
                  </Alert>
                ) : null}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl border-red-900/70 bg-red-950/20 text-red-200 hover:bg-red-950/40 hover:text-red-100">
                      Delete account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your entire account and all associated data. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={deleteAction}>
                      <AlertDialogFooter>
                        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Yes, delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

