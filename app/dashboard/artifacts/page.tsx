"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { 
  FileText, 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  MoreVertical,
  Filter,
  FileCode,
  CheckCircle2,
  LayoutList
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const projects = ["All Projects", "E-Commerce App", "HealthTrack AI", "Internal CRM"]

const artifacts = [
  {
    id: "ART-001",
    name: "User Stories: Authentication",
    type: "User Stories",
    project: "E-Commerce App",
    date: "2025-12-28",
  },
  {
    id: "ART-002",
    name: "Sprint 01 Backlog",
    type: "Sprint Backlog",
    project: "HealthTrack AI",
    date: "2025-12-30",
  },
  {
    id: "ART-003",
    name: "Definition of Done v1.2",
    type: "DOD",
    project: "E-Commerce App",
    date: "2025-12-29",
  },
  {
    id: "ART-004",
    name: "Persona: Healthcare Admin",
    type: "Persona",
    project: "HealthTrack AI",
    date: "2025-12-30",
  },
]

export default function ArtifactsPage() {
  const [activeFilter, setActiveFilter] = useState("All Projects")

  return (
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">My Artifacts</h1>
            <p className="text-muted-foreground">Browse and export all AI-generated Scrum documentation.</p>
          </div>
          <Image src="/artifacts-vault.svg" alt="Artifacts" width={100} height={80} className="hidden md:block opacity-90" />
        </div>

        {/* Rapid Filtering Bar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter size={14} />
            Filter by Project:
          </div>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <Badge 
                key={project}
                variant={activeFilter === project ? "default" : "outline"}
                className={`cursor-pointer px-4 py-1.5 transition-all ${
                  activeFilter === project ? 'brand-bg' : 'hover:bg-blue-50 hover:border-blue-200'
                }`}
                onClick={() => setActiveFilter(project)}
              >
                {project}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input placeholder="Search artifact name..." className="pl-10 h-10 border-border bg-white" />
          </div>
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export All
          </Button>
        </div>

        {/* Artifacts Table */}
        
        <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Artifact Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artifacts
                .filter(art => activeFilter === "All Projects" || art.project === activeFilter)
                .map((art) => (
                <TableRow key={art.id} className="hover:bg-muted/20 group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(art.type)}
                      {art.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{art.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {art.project}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {art.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:brand-text">
                        <Eye size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:brand-text">
                        <Download size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="size-8">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                            <Trash2 size={14} /> Delete Artifact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

// Helper to render type-specific icons
function getTypeIcon(type: string) {
  switch (type) {
    case 'User Stories': return <FileText size={18} className="text-blue-500" />
    case 'Sprint Backlog': return <LayoutList size={18} className="text-purple-500" />
    case 'DOD': return <CheckCircle2 size={18} className="text-green-500" />
    default: return <FileCode size={18} className="text-gray-400" />
  }
}