import { SignUpForm } from "@/components/sign-up-form"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-3xl" />
            {/* 
              TO ADD YOUR LOGO:
              1. Save your logo image as 'logo.png' 
              2. Place it in the 'public' folder at the root of your project
              3. The path should be: public/logo.png
              4. The logo will automatically appear here
              
              Supported formats: PNG, JPG, SVG
              Recommended size: 400x100px or similar aspect ratio
            */}
            <Image
              src="/logo.png"
              alt="AgileMentor AI Logo"
              width={400}
              height={100}
              className="relative h-16 w-auto"
              priority
            />
          </div>
          <p className="text-muted-foreground text-base">Your AI-powered Scrum Coach</p>
        </div>

        <div className="text-center space-y-3 pt-2">
          <h2 className="text-3xl font-bold text-foreground text-balance">Create Your Account</h2>
          <p className="text-muted-foreground">Get started with your AI-powered agile journey</p>
        </div>

        <SignUpForm />

        <div className="text-center pt-2">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href="/sign-in"
            className="font-semibold text-blue-500 hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
