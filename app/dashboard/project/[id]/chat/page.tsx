"use client"

import React, { useState, useRef, useEffect } from 'react'
import { 
  SendHorizontal, 
  Paperclip, 
  Copy, 
  Download, 
  History, 
  Sparkles, 
  Plus, 
  MoreVertical,
  ChevronRight,
  FileCode,
  CheckCircle2,
  Trash2,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from 'react-responsive'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
  
  // Mock data for the Chat Interface
  const messages = [
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I've loaded the context for **HealthTrack AI**. I'm ready to help you generate User Stories, Sprint Backlogs, or your Definition of Done. What's our first objective?",
      type: 'text'
    },
    {
      id: 2,
      role: 'user',
      content: "Can you generate 3 user stories for the patient registration module? Use the 'As a... I want... So that...' format.",
      type: 'text'
    },
    {
      id: 3,
      role: 'assistant',
      content: "Certainly. Based on your 'Patient' persona and the 'Next.js/Prisma' tech stack, here are the user stories for the registration module:",
      type: 'artifact',
      artifact: {
        title: "Patient Registration Stories",
        items: [
          "**US.1:** As a New Patient, I want to create an account using my email, so that I can access my health dashboard securely.",
          "**US.2:** As a Patient, I want to receive a confirmation email after signing up, so that I know my registration was successful.",
          "**US.3:** As an Admin, I want to validate patient identity documents, so that we remain compliant with healthcare regulations."
        ]
      }
    },
    {
      id: 5,
      role: 'assistant',
      content: "Hello! I've loaded the context for **HealthTrack AI**. I'm ready to help you generate User Stories, Sprint Backlogs, or your Definition of Done. What's our first objective?",
      type: 'text'
    },
    {
      id: 6,
      role: 'user',
      content: "Can you generate 3 user stories for the patient registration module? Use the 'As a... I want... So that...' format.",
      type: 'text'
    },
    {
      id: 7,
      role: 'assistant',
      content: "Hello! I've loaded the context for **HealthTrack AI**. I'm ready to help you generate User Stories, Sprint Backlogs, or your Definition of Done. What's our first objective?",
      type: 'text'
    },
    {
      id: 8,
      role: 'user',
      content: "Can you generate 3 user stories for the patient registration module? Use the 'As a... I want... So that...' format.",
      type: 'text'
    },
  ]

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [collapsed, setCollapsed] = useState(true)
  const toggleSidebar = () => setCollapsed(!collapsed)
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })

    useEffect(() => { if(isDesktopOrLaptop) setCollapsed(false) }, [])

  return (
    <div className="flex max-h-svh overflow-auto bg-background">
      {/* 1. Chat History Sidebar */}
      <aside className={`${collapsed ? "w-0" : "w-72"} border-r border-border bg-sidebar flex flex-col transition-all`}>
        <div className={collapsed ? "hidden" : "p-4"}>
          <Button variant="outline" className="w-full justify-start gap-2 border-dashed border-gray-300 hover:border-blue-400 brand-text">
            <Plus size={16} /> New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Recent Sprints</p>
              <HistoryItem label="Patient Registration" active />
              <HistoryItem label="Dashboard MVP" />
              <HistoryItem label="API Integration" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Artifacts</p>
              <HistoryItem label="DOD - Version 1.0" />
              <HistoryItem label="Persona: Dr. Smith" />
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* 2. Main Chat Area */}
      <main className="w-full max-h-svh flex-1 flex flex-col relative">
        {/* Header/Status */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Menu size={20} className="text-black cursor-pointer" onClick={toggleSidebar} />
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Sprint 01</Badge>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Patient Registration</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground"><Download size={16} /></Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground"><MoreVertical size={16} /></Button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 px-6 pt-6">
            <ScrollArea className="h-[85svh]">
            <div className="max-w-3xl mx-auto space-y-8 pb-48 md:pb-42">
                {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                    <Avatar className="size-8 brand-bg shadow-sm">
                        <AvatarFallback className="text-white"><Sparkles size={14} /></AvatarFallback>
                    </Avatar>
                    )}
                    
                    <div className={`space-y-3 max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    {msg.type === 'text' && (
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-black text-white rounded-tr-none' 
                        : 'bg-muted/50 text-foreground rounded-tl-none border border-border/50'
                        }`}>
                        {msg.content}
                        </div>
                    )}

                    {msg.type === 'artifact' && (
                        <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{msg.content}</p>
                        <ArtifactCard title={msg.artifact?.title} items={msg.artifact?.items} />
                        </div>
                    )}
                    </div>

                    {msg.role === 'user' && (
                    <Avatar className="size-8 bg-blue-100 border-none">
                        <AvatarFallback className="text-blue-600 font-bold text-xs">JD</AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
            </div>
            </ScrollArea>
        </div>

        {/* 3. Input Area */}
        <div className="absolute bottom-0 w-full p-6 bg-linear-to-t from-background via-background to-transparent">
          <div className="max-w-3xl mx-auto">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
              <QuickAction label="Write User Stories" />
              <QuickAction label="Refine Backlog" />
              <QuickAction label="Draft DOD" />
              <QuickAction label="Suggest Tasks" />
            </div>

            <div className="relative group shadow-lg rounded-2xl">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini to generate a Scrum artifact..."
                className="min-h-[60px] w-full p-4 pr-12 rounded-2xl bg-white border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all shadow-sm"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:brand-text">
                  <Paperclip size={18} />
                </Button>
                <Button size="icon" className="size-8 brand-bg hover:opacity-90 text-white rounded-lg">
                  <SendHorizontal size={18} />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Gemini can make mistakes. Always review AI-generated artifacts for your Agile Professional course.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- Helper Components ---

function HistoryItem({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group transition-colors ${
      active ? 'bg-blue-50 text-blue-700' : 'hover:bg-muted'
    }`}>
      <span className="text-sm font-medium truncate">{label}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
        <button className="p-1 hover:text-blue-600"><MoreVertical size={12} /></button>
      </div>
    </div>
  )
}

function ArtifactCard({ title, items }: any) {
  return (
    <Card className="border-border overflow-hidden shadow-md">
      <div className="bg-gray-50 border-b border-border px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="brand-text" />
          <span className="text-xs font-bold uppercase tracking-tight">{title}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="size-7"><Copy size={12} /></Button>
          <Button variant="ghost" size="icon" className="size-7"><Download size={12} /></Button>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-white">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex gap-3 items-start group">
            <div className="size-5 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={10} className="brand-text" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
      {label}
    </button>
  )
}