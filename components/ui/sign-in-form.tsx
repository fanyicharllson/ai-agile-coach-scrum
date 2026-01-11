"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chrome } from "lucide-react"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Add your authentication logic here
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    // Add your Google OAuth logic here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <Card className="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-600/10 pointer-events-none" />

      <CardHeader className="space-y-2 relative z-10 pb-6">
        <CardTitle className="text-2xl text-center font-bold text-foreground">Sign in to My Application</CardTitle>
        <CardDescription className="text-center text-muted-foreground text-base">
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="relative">
          <Button
            variant="outline"
            className="w-full bg-secondary/80 hover:bg-secondary border-border/50 hover:border-blue-500/50 transition-all duration-300 h-12 text-base shadow-lg hover:shadow-blue-500/10"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-sm px-2.5 py-0.5"
          >
            Last used
          </Badge>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-card px-4 text-muted-foreground font-medium tracking-wider">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-12 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all h-12 text-base mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue →"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
          >
            Forgot your password?
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
