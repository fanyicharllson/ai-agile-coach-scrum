"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome } from "lucide-react"

export function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }
    setIsLoading(true)
    // Add your authentication logic here
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleGoogleSignUp = () => {
    setIsLoading(true)
    // Add your Google OAuth logic here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <Card className="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-600/10 pointer-events-none" />

      <CardHeader className="space-y-2 relative z-10 pb-6">
        <CardTitle className="text-2xl text-center font-bold text-foreground">Create Your Account</CardTitle>
        <CardDescription className="text-center text-muted-foreground text-base">
          Join thousands of agile teams improving their process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <Button
          variant="outline"
          className="w-full bg-secondary/80 hover:bg-secondary border-border/50 hover:border-blue-500/50 transition-all duration-300 h-12 text-base shadow-lg hover:shadow-blue-500/10"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

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
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-12 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="signup-email" className="text-sm font-semibold text-foreground">
              Email address
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-12 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="signup-password" className="text-sm font-semibold text-foreground">
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-12 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-secondary/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all h-12 text-base mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account →"}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground leading-relaxed pt-2">
          By signing up, you agree to our{" "}
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 transition-colors underline-offset-2 hover:underline"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 transition-colors underline-offset-2 hover:underline"
          >
            Privacy Policy
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
