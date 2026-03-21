'use client'

import { useMemo } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/dashboard-layout'
import { SubscriptionItem } from '@/components/subscription-item'
import { SubscriptionProvider, useSubscriptions } from '@/lib/subscription-context'
import { Empty } from '@/components/ui/empty'

function UpcomingContent() {
  const { subscriptions } = useSubscriptions()

  const groupedPayments = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const groups = {
      today: [] as typeof subscriptions,
      thisWeek: [] as typeof subscriptions,
      thisMonth: [] as typeof subscriptions,
      later: [] as typeof subscriptions,
    }

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active')

    activeSubscriptions.forEach((sub) => {
      const billingDate = new Date(sub.nextBillingDate)
      billingDate.setHours(0, 0, 0, 0)
      const diffDays = Math.ceil((billingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        groups.today.push(sub)
      } else if (diffDays > 0 && diffDays <= 7) {
        groups.thisWeek.push(sub)
      } else if (diffDays > 7 && diffDays <= 30) {
        groups.thisMonth.push(sub)
      } else if (diffDays > 30) {
        groups.later.push(sub)
      }
    })

    // Sort each group by date
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    })

    return groups
  }, [subscriptions])

  const totalUpcoming = useMemo(() => {
    return [...groupedPayments.today, ...groupedPayments.thisWeek].reduce(
      (acc, sub) => acc + sub.price,
      0
    )
  }, [groupedPayments])

  const hasAnyPayments =
    groupedPayments.today.length > 0 ||
    groupedPayments.thisWeek.length > 0 ||
    groupedPayments.thisMonth.length > 0 ||
    groupedPayments.later.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upcoming Payments</h1>
        <p className="text-muted-foreground">View and track your upcoming subscription payments</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due This Week
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              ${totalUpcoming.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {groupedPayments.today.length + groupedPayments.thisWeek.length} payment(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Today
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {groupedPayments.today.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {groupedPayments.today.length > 0 ? 'Requires attention' : 'All clear'}
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {groupedPayments.today.length + groupedPayments.thisWeek.length + groupedPayments.thisMonth.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Payments scheduled
            </p>
          </CardContent>
        </Card>
      </div>

      {!hasAnyPayments ? (
        <Card>
          <CardContent className="py-12">
            <Empty
              title="No upcoming payments"
              description="All your subscriptions are up to date"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Today */}
          {groupedPayments.today.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Due Today</CardTitle>
                  <Badge variant="destructive">{groupedPayments.today.length}</Badge>
                </div>
                <CardDescription>Payments due today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedPayments.today.map((sub) => (
                    <SubscriptionItem key={sub.id} subscription={sub} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* This Week */}
          {groupedPayments.thisWeek.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>This Week</CardTitle>
                  <Badge variant="secondary">{groupedPayments.thisWeek.length}</Badge>
                </div>
                <CardDescription>Payments due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedPayments.thisWeek.map((sub) => (
                    <SubscriptionItem key={sub.id} subscription={sub} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* This Month */}
          {groupedPayments.thisMonth.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>This Month</CardTitle>
                  <Badge variant="outline">{groupedPayments.thisMonth.length}</Badge>
                </div>
                <CardDescription>Payments due in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedPayments.thisMonth.map((sub) => (
                    <SubscriptionItem key={sub.id} subscription={sub} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Later */}
          {groupedPayments.later.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Later</CardTitle>
                  <Badge variant="outline">{groupedPayments.later.length}</Badge>
                </div>
                <CardDescription>Payments due after 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedPayments.later.map((sub) => (
                    <SubscriptionItem key={sub.id} subscription={sub} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default function UpcomingPage() {
  return (
    <SubscriptionProvider>
      <DashboardLayout>
        <UpcomingContent />
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
