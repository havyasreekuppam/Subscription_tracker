'use client'

import { useState, useMemo } from 'react'
import { Plus, TrendingUp, CreditCard, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DashboardLayout } from '@/components/dashboard-layout'
import { SubscriptionItem } from '@/components/subscription-item'
import { SubscriptionForm } from '@/components/subscription-form'
import { SubscriptionProvider, useSubscriptions } from '@/lib/subscription-context'
import type { Subscription } from '@/lib/types'
import Link from 'next/link'

function DashboardContent() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions()
  const [formOpen, setFormOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
    const monthlySpending = activeSubscriptions.reduce((acc, sub) => {
      if (sub.billingCycle === 'monthly') {
        return acc + sub.price
      }
      return acc + sub.price / 12
    }, 0)
    const yearlySpending = monthlySpending * 12

    return {
      monthlySpending,
      yearlySpending,
      activeCount: activeSubscriptions.length,
    }
  }, [subscriptions])

  const upcomingPayments = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return subscriptions
      .filter(sub => {
        const billingDate = new Date(sub.nextBillingDate)
        return billingDate >= today && billingDate <= nextWeek && sub.status === 'active'
      })
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
  }, [subscriptions])

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, data)
    } else {
      addSubscription(data)
    }
    setEditingSubscription(null)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingSubscription(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your subscriptions</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Spending
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              ${stats.monthlySpending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yearly Spending
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              ${stats.yearlySpending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected annual cost
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {stats.activeCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptions.length - stats.activeCount} paused or expired
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Payments */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Payments</CardTitle>
              <Link href="/upcoming">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <CardDescription>Due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingPayments.length > 0 ? (
              <div className="space-y-1">
                {upcomingPayments.map((sub) => (
                  <SubscriptionItem
                    key={sub.id}
                    subscription={sub}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No upcoming payments this week</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Subscriptions</CardTitle>
              <Link href="/subscriptions">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <CardDescription>Manage all your active subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {subscriptions.length > 0 ? (
              <div className="space-y-3">
                {subscriptions.slice(0, 5).map((sub) => (
                  <SubscriptionItem
                    key={sub.id}
                    subscription={sub}
                    onEdit={handleEdit}
                    onDelete={deleteSubscription}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <CreditCard className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No subscriptions yet</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setFormOpen(true)}
                >
                  Add your first subscription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SubscriptionForm
        open={formOpen}
        onOpenChange={handleFormClose}
        subscription={editingSubscription}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <SubscriptionProvider>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
