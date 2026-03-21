'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
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
import { DashboardLayout } from '@/components/dashboard-layout'
import { SubscriptionItem } from '@/components/subscription-item'
import { SubscriptionForm } from '@/components/subscription-form'
import { SubscriptionProvider, useSubscriptions } from '@/lib/subscription-context'
import { categories } from '@/lib/data'
import type { Subscription } from '@/lib/types'
import { Empty } from '@/components/ui/empty'

function SubscriptionsContent() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions()
  const [formOpen, setFormOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [billingFilter, setBillingFilter] = useState('all')

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter
      const matchesBilling = billingFilter === 'all' || sub.billingCycle === billingFilter
      return matchesSearch && matchesCategory && matchesBilling
    })
  }, [subscriptions, searchQuery, categoryFilter, billingFilter])

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
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">Manage all your subscriptions</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={billingFilter} onValueChange={setBillingFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Billing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>
            {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length > 0 ? (
            <div className="space-y-3">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionItem
                  key={sub.id}
                  subscription={sub}
                  onEdit={handleEdit}
                  onDelete={deleteSubscription}
                />
              ))}
            </div>
          ) : (
            <Empty
              title="No subscriptions found"
              description={
                searchQuery || categoryFilter !== 'all' || billingFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first subscription to get started'
              }
            >
              {!searchQuery && categoryFilter === 'all' && billingFilter === 'all' && (
                <Button onClick={() => setFormOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subscription
                </Button>
              )}
            </Empty>
          )}
        </CardContent>
      </Card>

      <SubscriptionForm
        open={formOpen}
        onOpenChange={handleFormClose}
        subscription={editingSubscription}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

export default function SubscriptionsPage() {
  return (
    <SubscriptionProvider>
      <DashboardLayout>
        <SubscriptionsContent />
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
