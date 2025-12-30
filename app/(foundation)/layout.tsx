import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'


export default function FoundationLayout({children}: {children: React.ReactNode}) {
  	return (
		<div className="min-h-screen bg-white text-black font-sans">
			{/* Navigation */}
			<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
				<nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
					<Link href="/" className="flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<Zap className="text-white size-5" />
					</div>
					<span className="font-bold text-xl tracking-tight">AgileFlow</span>
					</Link>
					<div className="flex gap-4 items-center">
						<Link href="/auth/login" className="text-sm font-medium hover:text-blue-600 transition-colors">Login</Link>
						<Button asChild className="bg-black hover:bg-blue-600 text-white rounded-full px-6">
							<Link href="/auth/signup">Get Started</Link>
						</Button>
					</div>
				</nav>
			</header>
			<main className="flex-1">
				{children}
			</main>
			{/* Course Context Footer */}
			<footer className="border-t border-gray-100 py-12 px-6">
				<div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-sm text-gray-500">
					© 2024 AgileFlow Project • Developed for Agile Professional Course
				</div>
				<div className="flex gap-8 text-sm font-medium">
					<span>Next.js 16 + Tailwind 4</span>
					<span>Google Gemini AI</span>
					<span>Prisma ORM</span>
				</div>
				</div>
			</footer>
		</div>
  	)
}