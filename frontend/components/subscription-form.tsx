'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import type { Subscription } from '@/lib/types'
import { categories } from '@/lib/data'

interface SubscriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription?: Subscription | null
  onSubmit: (data: Omit<Subscription, 'id'>) => void
}

const iconOptions = [
  { value: 'tv', label: 'TV / Streaming' },
  { value: 'music', label: 'Music' },
  { value: 'palette', label: 'Design' },
  { value: 'code', label: 'Development' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'book-open', label: 'Productivity' },
  { value: 'message-square', label: 'Communication' },
  { value: 'figma', label: 'Figma' },
]

const colorOptions = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#333333', label: 'Dark' },
]

export function SubscriptionForm({
  open,
  onOpenChange,
  subscription,
  onSubmit,
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'tv',
    category: 'Entertainment',
    price: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    nextBillingDate: '',
    status: 'active' as 'active' | 'paused' | 'expired',
    color: '#3b82f6',
  })

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || "",

        // ✅ FIX: safe fallback
        icon: subscription.icon || "tv",

        category: subscription.category || "Entertainment",

        // ✅ FIX: cost → price
        price: subscription.cost?.toString() || "",

        billingCycle: subscription.billingCycle || "monthly",

        // ✅ FIX: correct field name
        nextBillingDate: subscription.nextPaymentDate || "",

        // ✅ FIX: safe fallback
        status: (subscription.status as "active" | "paused" | "expired") || "active",

        // ✅ FIX: spelling + fallback
        color: subscription.color || "#3b82f6",
      })
    } else {
      setFormData({
        name: "",
        icon: "tv",
        category: "Entertainment",
        price: "",
        billingCycle: "monthly",
        nextBillingDate: "",
        status: "active",
        color: "#3b82f6",
      })
    }
  }, [subscription, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name: formData.name,
      icon: formData.icon,
      category: formData.category,

      // ✅ FIXED FIELD NAME
      cost: parseFloat(formData.price) || 0,

      billingCycle: formData.billingCycle,

      // ✅ FIXED FIELD NAME
      nextPaymentDate: formData.nextBillingDate,

      status: formData.status,
      color: formData.color,
    } as any) // 👈 TEMP FIX to avoid TS error

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Edit Subscription' : 'Add Subscription'}
          </DialogTitle>
          <DialogDescription>
            {subscription
              ? 'Update your subscription details below.'
              : 'Add a new subscription to track your spending.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Subscription Name</FieldLabel>
              <Input
                placeholder="e.g., Netflix, Spotify"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Cost</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="9.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Billing Cycle</FieldLabel>
                <Select
                  value={formData.billingCycle}
                  onValueChange={(value: 'monthly' | 'yearly') =>
                    setFormData({ ...formData, billingCycle: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Next Billing Date</FieldLabel>
              <Input
                type="date"
                value={formData.nextBillingDate}
                onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'paused' | 'expired') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Icon</FieldLabel>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Color</FieldLabel>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {subscription ? 'Save Changes' : 'Add Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
