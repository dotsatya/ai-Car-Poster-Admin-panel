"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated, isLoading } = useAuth()
  const [name, setName] = React.useState("Admin One")
  const [email, setEmail] = React.useState("admin1@gmail.com")
  const [password, setPassword] = React.useState("0000")
  const [confirmPassword, setConfirmPassword] = React.useState("0000")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    const res = await signup(name, email, password)
    if (!res.success) {
      setError(res.error || "Signup failed. Please try again.")
      setSubmitting(false)
    }
  }

  async function handleGoogleSignup() {
    setError(null)
    setSubmitting(true)
    const res = await signup("Admin One", "admin1@gmail.com", "0000")
    if (!res.success) {
      setError(res.error || "Google signup failed.")
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Brand mark */}
      <Link href="/dashboard" className="flex items-center gap-2 mb-6 group transition-opacity hover:opacity-90">
        <div className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-zinc-900 to-black border border-primary/40 text-white shadow-sm shadow-red-950/40">
          <span className="text-xs font-semibold tracking-tight">
            P<span className="text-primary">G</span>
          </span>
        </div>
        <span className="font-semibold text-sm tracking-wide text-foreground">
          POSTER <span className="text-primary font-semibold">GEN</span>
        </span>
      </Link>

      {/* Signup Card */}
      <div className="w-full max-w-sm rounded-md border border-border/80 bg-card p-6 shadow-xl shadow-black/40 text-card-foreground">
        <div className="flex flex-col space-y-1.5 pb-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-sm font-normal text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        {/* Quick Demo Credentials Pill */}
        <div className="mb-4 rounded-md border border-primary/25 bg-primary/10 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
          <div className="leading-tight">
            <span className="font-medium text-foreground">Demo:</span> admin1@gmail.com
            <span className="mx-1 text-muted-foreground/60">•</span>
            <span className="font-medium text-foreground">Pass:</span> 0000
          </div>
          <button
            type="button"
            onClick={() => {
              setName("Admin One")
              setEmail("admin1@gmail.com")
              setPassword("0000")
              setConfirmPassword("0000")
            }}
            className="rounded-md bg-primary/20 hover:bg-primary/30 text-primary px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Fill
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground uppercase tracking-[0.03em]">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Alexander Drake"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground uppercase tracking-[0.03em]">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground uppercase tracking-[0.03em]">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground uppercase tracking-[0.03em]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-foreground text-background font-medium py-2 text-sm hover:bg-foreground/90 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border/80 bg-background/50 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            <GoogleIcon />
            <span>Sign up with Google</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-normal text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 text-foreground font-medium hover:text-primary transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
