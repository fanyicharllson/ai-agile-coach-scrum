"use client"

import React from 'react'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Save, 
  Camera,
  LogOut,
  Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const profileSchema = z.object({
  username: z.string().min(2, "Username is required"),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
})

export default function SettingsPage() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "John Doe",
      email: "john.doe@university.edu",
      bio: "Agile Professional student and aspiring Scrum Master."
    }
  })

  return (
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and application preferences.</p>
          </div>
          <Image src="/settings-hero.svg" alt="Settings" width={120} height={100} className="hidden md:block" />
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="profile" className="gap-2"><User size={16} /> Profile</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Lock size={16} /> Security</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell size={16} /> Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>This information will be visible to your group members.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="size-24 rounded-full brand-bg flex items-center justify-center text-white text-3xl font-bold">
                      JD
                    </div>
                    <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                    </button>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input {...field} disabled /></FormControl>
                          <FormDescription>Email changes require verification.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="brand-bg text-white gap-2">
                      <Save size={16} /> Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div>Current Password</div>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <div>New Password</div>
                  <Input type="password" />
                </div>
                <Button variant="outline" className="border-blue-200 text-blue-600">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-red-50/30">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversibly delete your account and all associated Scrum projects.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="gap-2">
                  <Trash2 size={16} /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Decide how you want to be notified about project updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Artifact Generation Complete</p>
                    <p className="text-xs text-muted-foreground">Receive a notification when Gemini finishes a complex backlog.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Team Activity</p>
                    <p className="text-xs text-muted-foreground">Get notified when a group member updates the project context.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}