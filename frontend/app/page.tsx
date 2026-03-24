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
      if (sub.billingCycle === 'monthly') return acc + sub.price
      return acc + sub.price / 12
    }, 0)

    return {
      monthlySpending,
      yearlySpending: monthlySpending * 12,
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
    if (!open) setEditingSubscription(null)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60">Track and manage your subscriptions</p>
        </div>

        <Button 
          onClick={() => setFormOpen(true)} 
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Monthly */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-white/60">Monthly Spending</CardTitle>
            <CreditCard className="h-4 w-4 text-white/60" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${stats.monthlySpending.toFixed(2)}
            </div>
            <p className="text-xs text-white/60">
              <span className="text-green-400">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Yearly */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-white/60">Yearly Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/60" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${stats.yearlySpending.toFixed(2)}
            </div>
            <p className="text-xs text-white/60">Projected annual cost</p>
          </CardContent>
        </Card>

        {/* Active */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-white/60">Active Subscriptions</CardTitle>
            <Calendar className="h-4 w-4 text-white/60" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.activeCount}
            </div>
            <p className="text-xs text-white/60">
              {subscriptions.length - stats.activeCount} paused or expired
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Upcoming Payments */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Upcoming Payments</CardTitle>

              <Link href="/upcoming">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-white hover:bg-white/10 hover:text-white">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <CardDescription className="text-white/60">
              Due in the next 7 days
            </CardDescription>
          </CardHeader>

          <CardContent>
            {upcomingPayments.length > 0 ? (
              <div className="space-y-1">
                {upcomingPayments.map((sub) => (
                  <SubscriptionItem key={sub.id} subscription={sub} compact />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-white/60">
                <Calendar className="mx-auto mb-3 h-10 w-10 opacity-40" />
                <p>No upcoming payments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Your Subscriptions</CardTitle>

              <Link href="/subscriptions">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-white hover:bg-white/10 hover:text-white">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <CardDescription className="text-white/60">
              Manage all your active subscriptions
            </CardDescription>
          </CardHeader>

          <CardContent>
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
              <div className="py-10 text-center text-white/60">
                <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-40" />
                <p>No subscriptions yet</p>

                <Button
                  variant="ghost"
                  className="mt-3 text-white hover:bg-white/10"
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