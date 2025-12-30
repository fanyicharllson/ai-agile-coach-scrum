"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Linkedin, Github, Mail } from "lucide-react"

const teamMembers = [
  {
    name: "Fanyi Charllson",
    role: "Group Leader | Scrum Master",
    description: "Facilitates the Scrum process, removes impediments, and ensures the team follows Agile values.",
    skills: ["Facilitation", "Coaching", "Problem Solving"]
  },
  {
    name: "I dont Know",
    role: "Product Owner",
    description: "Responsible for maximizing the value of the product by managing and optimizing the Product Backlog.",
    skills: ["Vision", "Prioritization", "Stakeholders"]
  },
  {
    name: "Nindjio Abraham",
    role: "Frontend Developer",
    description: "Leads the development of the Next.js application, ensuring a seamless AI chat experience.",
    skills: ["Next.js", "Tailwind 4", "Shadcn UI"]
  },
  {
    name: "Ambanawah Carlos Tongah",
    role: "Documentation Lead",
    description: "Ensures all Scrum artifacts and project reports are precise and meet course standards.",
    skills: ["Technical Writing", "Agile Reports", "QA"]
  }
]

export default function AboutUs() {
  return (
      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black">Meet the <span className="brand-text">Scrum Team</span>.</h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Our group is composed of students dedicated to bridging the gap between AI potential and Agile methodology. This project represents our final submission for the Agile Professional course.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Image 
              src="/team-collaboration.svg" 
              alt="Team Illustration" 
              width={400} 
              height={300}
              className="w-full max-w-sm"
            />
          </div>
        </section>

        {/* Team Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-border hover:border-blue-300 transition-all group overflow-hidden">
                <CardHeader className="brand-bg py-4 text-white">
                  <div className="size-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <span className="font-bold text-lg">{member.name.charAt(0)}</span>
                  </div>
                  <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit bg-white text-blue-600 border-none font-bold">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, sIndex) => (
                      <span key={sIndex} className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        • {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-2 border-t border-border mt-4">
                    <Linkedin size={16} className="text-muted-foreground hover:brand-text cursor-pointer" />
                    <Github size={16} className="text-muted-foreground hover:brand-text cursor-pointer" />
                    <Mail size={16} className="text-muted-foreground hover:brand-text cursor-pointer" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Course Info Footer */}
        <section className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg">Instructor: Dr. KEYAMPI Martial</h3>
            <h4 className="font-bold text-lg text-muted-foreground">Course: Agile Professional (FALL2025)</h4>
            <p className="text-sm text-muted-foreground">University Group Work • Project: AgileFlow AI Coach</p>
          </div>
          <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900">
            <Link href="https://ictuniversity.org/">Visit the University</Link>
          </Button>
        </section>
      </div>
  )
}