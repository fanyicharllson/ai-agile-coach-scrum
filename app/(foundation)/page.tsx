import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, ClipboardCheck, Users } from "lucide-react";

export default function LandingPage() {
	return (
		<div>
		{/* Hero Section */}
		<section className="container mx-auto px-6 py-9 flex flex-col lg:flex-row items-center gap-12">
			<div className="flex-1 space-y-8 text-center lg:text-left">
			<div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
				Agile Professional Course Project
			</div>
			<h1 className="text-6xl font-black leading-tight lg:text-7xl">
				Ship faster with <span className="text-blue-600">AI-Powered</span> Scrum.
			</h1>
			<p className="text-xl text-gray-600 max-w-2xl">
				Generate user stories, sprint backlogs, and acceptance criteria in seconds. Built by students, for the next generation of Agile Professionals.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
				<Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg rounded-xl">
				<Link href="/auth/signup">Start Your First Sprint <ArrowRight className="ml-2" /></Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl border-black hover:bg-black hover:text-white">
				<Link href="/about">View Team Members</Link>
				</Button>
			</div>
			</div>
			<div className="flex-1 w-full max-w-lg lg:max-w-none">
			<img src="/agile-cards-illustration.svg" alt="Kanban Cards"/>
			</div>
		</section>

		{/* Feature Grid */}
		<section className="bg-gray-50 py-24">
			<div className="container mx-auto px-6">
			<div className="text-center mb-16">
				<h2 className="text-3xl font-bold mb-4">Core Artifact Generation</h2>
				<p className="text-gray-500">Everything you need to pass your Agile Professional cert.</p>
			</div>
			<div className="grid md:grid-cols-3 gap-8">
				<FeatureCard 
				icon={<Bot className="text-blue-600" />}
				title="AI Backlog Grooming"
				description="Transform a simple product vision into a structured list of prioritized user stories."
				/>
				<FeatureCard 
				icon={<ClipboardCheck className="text-blue-600" />}
				title="Definition of Done"
				description="Standardize your quality checks with AI-generated DODs tailored to your tech stack."
				/>
				<FeatureCard 
				icon={<Users className="text-blue-600" />}
				title="Persona Mapping"
				description="Identify and describe your users automatically to build empathy into your stories."
				/>
			</div>
			</div>
		</section>

		<section className="py-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
			<h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">
				How AgileFlow Works
			</h2>
			
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div>
				<div className="space-y-8">
					{[
					{ step: "1", title: "Create Project", desc: "Create a global scope for the different interactions." },
					{ step: "2", title: "Give Context", desc: "Tell the AI details about what you want to achieve." },
					{ step: "3", title: "Chat with Agent", desc: "Let the Agent guide you to you objectives." },
					{ step: "4", title: "Export Artifacts", desc: "Integrate to your workflow using generated assets." }
					].map((item, index) => (
					<div key={index} className="flex gap-4">
						<div className="shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
						{item.step}
						</div>
						<div>
						<h3 className="text-xl font-semibold text-black mb-2">{item.title}</h3>
						<p className="text-gray-600">{item.desc}</p>
						</div>
					</div>
					))}
				</div>
				</div>
				
				<div className="relative">
				<img
					src="/flow-illustration.svg"
					alt="How it Works"
					className="w-full h-auto rounded-xl shadow-xl"
				/>
				</div>
			</div>
			</div>
      </section>
		</div>
	);
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}