'use client'

import { useState } from 'react'
import { User, Bell, DollarSign, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DashboardLayout } from '@/components/dashboard-layout'
import { SubscriptionProvider } from '@/lib/subscription-context'
import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

function SettingsContent() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
  })

  const [preferences, setPreferences] = useState({
    currency: 'USD',
    notifications: true,
    emailReminders: true,
    weeklyReport: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>
            <div className="flex-1">
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </Field>
              </FieldGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Preferences</CardTitle>
          </div>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Currency</FieldLabel>
              <Select
                value={preferences.currency}
                onValueChange={(value) => setPreferences({ ...preferences, currency: value })}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR ()</SelectItem>
                  <SelectItem value="GBP">GBP ()</SelectItem>
                  <SelectItem value="INR">INR ()</SelectItem>
                  <SelectItem value="JPY">JPY ()</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose your preferred currency for displaying prices
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about upcoming payments
                </p>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, notifications: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Email Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get email reminders before payment due dates
                </p>
              </div>
              <Switch
                checked={preferences.emailReminders}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, emailReminders: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Weekly Report</p>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your subscriptions
                </p>
              </div>
              <Switch
                checked={preferences.weeklyReport}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, weeklyReport: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <SubscriptionProvider>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
