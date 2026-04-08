"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { useSubscriptions } from '@/lib/subscription-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Subscription } from "@/lib/types"
import { SubscriptionProvider } from '@/lib/subscription-context'

function UpcomingContent() {
  const { subscriptions } = useSubscriptions() as { subscriptions: Subscription[] }

  // ✅ HYDRATION FIX
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activeSubs = subscriptions.filter(
    (sub) => (sub.status ?? "active") === "active"
  )

  const groups = {
    today: [] as Subscription[],
    thisWeek: [] as Subscription[],
    thisMonth: [] as Subscription[],
    later: [] as Subscription[],
  }

  activeSubs.forEach((sub) => {
    const nextDate = new Date(sub.nextPaymentDate)
    nextDate.setHours(0, 0, 0, 0)

    const diffDays =
      (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

    if (diffDays === 0) {
      groups.today.push(sub)
    } else if (diffDays <= 7) {
      groups.thisWeek.push(sub)
    } else if (diffDays <= 30) {
      groups.thisMonth.push(sub)
    } else {
      groups.later.push(sub)
    }
  })

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Upcoming Payments
        </h1>
        <p className="text-white/60">
          View and track your upcoming subscription payments
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-white">Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mounted
                ? formatCurrency(groups.thisWeek.reduce((sum, s) => sum + s.cost, 0))
                : "₹0.00"}
            </div>
            <p className="text-white/50">
              {groups.thisWeek.length} payment(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {groups.today.length}
            </div>
            <p className="text-white/50">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {groups.thisMonth.length}
            </div>
            <p className="text-white/50">Payments scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* TODAY */}
      {groups.today.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Due Today
              <Badge className="bg-red-500 text-white">
                {groups.today.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-white/60">
              Payments due today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {groups.today.map((sub) => (
              <div
                key={sub.id || sub._id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{sub.name}</p>
                  <p className="text-sm text-white/50">
                    {mounted
                      ? new Date(sub.nextPaymentDate).toDateString()
                      : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatCurrency(sub.cost)}
                  </p>
                  <Badge className="bg-red-500 text-white mt-1">
                    Today
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* THIS WEEK */}
      {groups.thisWeek.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              This Week
              <Badge className="bg-white/20 text-white">
                {groups.thisWeek.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-white/60">
              Payments due in the next 7 days
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {groups.thisWeek.map((sub) => (
              <div key={sub.id || sub._id} className="flex justify-between px-4 py-3">
                <div>
                  <p className="text-white">{sub.name}</p>
                  <p className="text-white/50 text-sm">
                    {mounted
                      ? new Date(sub.nextPaymentDate).toDateString()
                      : ""}
                  </p>
                </div>
                <p className="text-white font-semibold">
                  {formatCurrency(sub.cost)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* THIS MONTH */}
      {groups.thisMonth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {groups.thisMonth.map((sub) => (
              <div key={sub.id || sub._id} className="flex justify-between px-4 py-3">
                <p>{sub.name}</p>
                <p>{formatCurrency(sub.cost)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* LATER */}
      {groups.later.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Later</CardTitle>
          </CardHeader>
          <CardContent>
            {groups.later.map((sub) => (
              <div key={sub.id || sub._id} className="flex justify-between px-4 py-3">
                <p>{sub.name}</p>
                <p>{formatCurrency(sub.cost)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
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