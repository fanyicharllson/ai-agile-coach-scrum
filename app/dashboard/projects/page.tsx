"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Plus, 
  MoreHorizontal, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  FolderKanban,
  Search
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

const projects = [
  {
    id: "1",
    name: "E-Commerce App",
    status: "Active",
    artifacts: 14,
    lastUpdated: "2025-12-28",
  },
  {
    id: "2",
    name: "HealthTrack AI",
    status: "Planning",
    artifacts: 5,
    lastUpdated: "2025-12-30",
  },
  {
    id: "3",
    name: "Internal CRM",
    status: "Completed",
    artifacts: 28,
    lastUpdated: "2025-11-15",
  },
]

export default function ProjectsPage() {
  return (
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="brand-bg p-3 rounded-xl shadow-lg shadow-blue-200">
              <FolderKanban className="text-white size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">Manage and organize your Agile workspaces.</p>
            </div>
          </div>
          <Button className="brand-bg text-white gap-2 h-11 px-6 shadow-md hover:opacity-90">
            <Plus size={18} />
            New Project
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input placeholder="Search projects..." className="pl-10 h-10 border-border" />
          </div>
          <Image src="/projects-list.svg" alt="Projects" width={80} height={60} className="ml-auto opacity-80" />
        </div>

        {/* Projects Table */}
        <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[300px]">Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Artifacts</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-foreground">
                    {project.name}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={project.status === "Active" ? "default" : "secondary"}
                      className={project.status === "Active" ? "brand-bg" : ""}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.artifacts} items
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                          <Link href={`/dashboard/project/${project.id}/chat`}>
                          <ExternalLink size={14} className="brand-text" /> Open
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Pencil size={14} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State Hint */}
        <p className="text-center text-xs text-muted-foreground italic">
          Tip: You can group projects by course semester in the settings.
        </p>
      </div>
    </div>
  )
}