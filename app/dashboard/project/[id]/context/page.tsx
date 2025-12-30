"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { 
  Save, 
  Plus, 
  Trash2, 
  Info, 
  Target, 
  Users, 
  Code2, 
  CheckSquare,
  Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const contextSchema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  projectGoal: z.string().min(10, "Please provide a more detailed goal"),
  techStack: z.string(),
  personas: z.array(z.object({
    name: z.string().min(1, "Name required"),
    role: z.string().min(1, "Role required")
  })).min(1, "At least one persona is needed"),
  definitionOfDone: z.string()
})

export default function ProjectContextPage() {
  const form = useForm<z.infer<typeof contextSchema>>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      projectName: "",
      projectGoal: "",
      techStack: "Next.js, Tailwind, Prisma",
      personas: [{ name: "Admin", role: "Manages system settings" }],
      definitionOfDone: "Code reviewed, Unit tests passed, UI matches design."
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "personas"
  })

  function onSubmit(data: z.infer<typeof contextSchema>) {
    console.log("Context Updated:", data)
    // Here you would use TanStack Query to update Prisma
  }

  return (
    <div className="flex-1 max-h-svh bg-background p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Context</h1>
            <p className="text-muted-foreground mt-1">
              Configure the parameters Gemini uses to generate your Scrum artifacts.
            </p>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} className="brand-bg hover:opacity-90 text-white gap-2">
            <Save size={18} />
            Save Context
          </Button>
        </div>

        <Form {...form}>
          <form className="space-y-8">
            {/* 1. Vision & Goals */}
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center brand-text">
                  <Target size={24} />
                </div>
                <div>
                  <CardTitle>Product Vision</CardTitle>
                  <CardDescription>What are we building and why?</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. HealthTrack AI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Objective</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe the core value proposition..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 2. Personas & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personas */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="brand-text" size={20} />
                      <CardTitle className="text-lg">Personas</CardTitle>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => append({ name: "", role: "" })}
                      className="h-8 gap-1"
                    >
                      <Plus size={14} /> Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input placeholder="Name" {...form.register(`personas.${index}.name`)} />
                        <Input placeholder="Role" {...form.register(`personas.${index}.role`)} className="text-xs text-muted-foreground" />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Code2 className="brand-text" size={20} />
                  <CardTitle className="text-lg">Tech Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="techStack"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. React, Node.js, PostgreSQL..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Helps AI suggest technical tasks and DOD items.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 3. Definition of Done */}
            <Card className="border-border shadow-sm glass">
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckSquare className="brand-text" size={20} />
                <CardTitle className="text-lg">Definition of Done (DOD)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="definitionOfDone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Standard quality requirements..." 
                          className="min-h-[100px] bg-white/50"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* AI Optimization Note */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-center">
              <div className="brand-bg p-2 rounded-full">
                <Sparkles className="text-white size-4" />
              </div>
              <p className="text-sm text-blue-800">
                <strong>Gemini Sync:</strong> These settings are automatically injected into your chat prompts to provide context-aware suggestions.
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}