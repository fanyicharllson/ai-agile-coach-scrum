"use client"
import React, { use } from 'react'
import { 
  Plus, 
  LayoutDashboard, 
  Folder, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
  SidebarOpen,
  SidebarClose,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
	const [collapsed, setCollapsed] = React.useState(false);
	const toggleSidebar = () => setCollapsed(!collapsed);
  return (
    <div className="flex h-screen max-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className={`${ collapsed ? "w-24" : "w-64"} border-r border-border bg-sidebar flex flex-col transition-all`}>
			<div className={`${collapsed ? "py-6 mx-auto" : 'p-6'} flex items-center justify-between gap-2`}>
				<div className={`flex items-center gap-2 ${ collapsed ? "hidden": "" }`}>
					<div className="brand-bg size-8 rounded-lg flex items-center justify-center">
					<Sparkles className="text-white size-5" />
					</div>
					<span className="font-bold text-xl">AgileFlow</span>
				</div>
				{ collapsed ? <SidebarOpen className="cursor-pointer" onClick={toggleSidebar}/> : <SidebarClose className="cursor-pointer" onClick={toggleSidebar}/>}
			</div>
        
			<nav className={`flex-1 ${collapsed ? "mx-auto" : "px-4"} space-y-2 mt-4`}>
				<NavItem href='/dashboard' isCollapsed={collapsed} icon={<LayoutDashboard size={20} />} label="Dashboard" />
				<NavItem href='/dashboard/projects' isCollapsed={collapsed} icon={<Folder size={20} />} label="My Projects" />
				<NavItem href='/dashboard/artifacts' isCollapsed={collapsed} icon={<FileText size={20} />} label="Artifact Library" />
				<NavItem href='/dashboard/settings' isCollapsed={collapsed} icon={<User size={20} />} label="Settings" />
			</nav>
	
			<div className={`${ collapsed ? "py-4" : "p-4"} border-t border-border`}>
				<Button variant="ghost" className="justify-start gap-2 text-muted-foreground hover:text-blue-50">
				<LogOut size={20} />
				{collapsed ? "" : "Logout"}
				</Button>
			</div>
		</aside>
		<div className='flex-1'>{children}</div>
    </div>
  )
}

function NavItem({ icon, href, label, isCollapsed}: { icon: React.ReactNode, href: string, label: string, isCollapsed: boolean}) {
	const active = usePathname() === href;
	return (
	<Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
	  active ? 'brand-bg text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
	}`}>
	  {icon}
	  {(!isCollapsed) && <span className="font-medium text-sm">{label}</span>}
	</Link>
  )
}