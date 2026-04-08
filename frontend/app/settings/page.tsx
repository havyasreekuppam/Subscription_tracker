'use client'

import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useState, useEffect, useRef } from 'react'
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
    name: '',
    email: '',
  })

  const [preferences, setPreferences] = useState({
    currency: 'INR',
    notifications: true,
    emailReminders: true,
    weeklyReport: false,
  })

  const [saved, setSaved] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 🔥 Load saved image + user
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage")
    let savedImageIsValid = false

    if (savedImage && !savedImage.startsWith("blob:")) {
      setImage(savedImage)
      savedImageIsValid = true
    } else if (savedImage && savedImage.startsWith("blob:")) {
      localStorage.removeItem("profileImage")
    }

    const savedPreferences = localStorage.getItem("subscriptionPreferences")
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences((current) => ({
          ...current,
          ...parsed,
        }))
      } catch {
        localStorage.removeItem("subscriptionPreferences")
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile({
          name:
            user.displayName ||
            user.email?.split('@')[0] ||
            '',
          email: user.email || '',
        })

        if (!savedImageIsValid && user.photoURL) {
          setImage(user.photoURL)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const savePreferences = (nextPreferences: typeof preferences) => {
    setPreferences(nextPreferences)
    localStorage.setItem("subscriptionPreferences", JSON.stringify(nextPreferences))
  }

  const handleSave = () => {
    localStorage.setItem("subscriptionPreferences", JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // 📁 Upload + save
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const imageUrl = reader.result as string
        setImage(imageUrl)

        // ✅ Save in localStorage
        localStorage.setItem("profileImage", imageUrl)
        window.dispatchEvent(new Event("profileImageUpdated"))

        setShowModal(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/60">Manage your account and preferences</p>
      </div>

      {/* Profile */}
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

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                {image ? (
                  <img
                    src={image}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                )}
              </Avatar>

              <Button
                size="sm"
                onClick={() => setShowModal(true)}
                className="text-white bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-lg px-4 py-2 shadow-[0_0_20px_rgba(90,108,255,0.4)]"
              >
                Change Photo
              </Button>
            </div>

            {/* Inputs */}
            <div className="flex-1">
              <FieldGroup>

                <Field>
                  <FieldLabel className="text-white/80">Full Name</FieldLabel>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </Field>

              </FieldGroup>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl space-y-4">

            <h2 className="text-lg font-semibold text-white">
              Upload Photo
            </h2>

            <button
              className="w-full bg-blue-500 p-2 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose from Device
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
            />

            <button
              className="w-full bg-red-500 p-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* Preferences */}
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
                onValueChange={(value) =>
                  setPreferences({ ...preferences, currency: value })
                }
              >
                <SelectTrigger className="w-full sm:w-50">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                </SelectContent>
              </Select>

              <FieldDescription className="text-white/60">
                Choose your preferred currency for displaying prices
              </FieldDescription>

            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Notifications */}
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
              <div>
                <p className="text-sm font-medium text-white">
                  Push Notifications
                </p>
                <p className="text-sm text-white/60">
                  Receive notifications about upcoming payments
                </p>
              </div>

              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  savePreferences({ ...preferences, notifications: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Email Reminders
                </p>
                <p className="text-sm text-white/60">
                  Get email reminders before payment due dates
                </p>
              </div>

              <Switch
                checked={preferences.emailReminders}
                onCheckedChange={(checked) =>
                  savePreferences({ ...preferences, emailReminders: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Weekly Report
                </p>
                <p className="text-sm text-white/60">
                  Receive a weekly summary
                </p>
              </div>

              <Switch
                checked={preferences.weeklyReport}
                onCheckedChange={(checked) =>
                  savePreferences({ ...preferences, weeklyReport: checked })
                }
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="gap-2 text-white bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-[0_0_20px_rgba(90,108,255,0.4)]"
        >
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