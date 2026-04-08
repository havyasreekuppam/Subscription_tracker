"use client"
import type { Subscription } from "@/lib/types"
import { useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptions } from "@/lib/subscription-context"
import { formatCurrency } from "@/lib/formatCurrency"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#22c55e", "#f59e0b"]

function AnalyticsContent() {
  const { subscriptions } = useSubscriptions() as { subscriptions: Subscription[] }

  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(
      (s) => {
  const status = s.status || "active"
  return status === "active"
}
    )

    const monthlySpending = activeSubscriptions.reduce((acc, sub) => {
      if (sub.billingCycle === "monthly") return acc + sub.cost
      return acc + sub.cost / 12
    }, 0)

    const yearlySpending = monthlySpending * 12

    const categories = activeSubscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.cost
      return acc
    }, {} as Record<string, number>)

    return {
      monthlySpending,
      yearlySpending,
      activeCount: activeSubscriptions.length,
      categories,
    }
  }, [subscriptions])

  const upcoming = useMemo(() => {
    const today = new Date()

    return subscriptions
      .filter((s) => {
  const status = s.status || "active"
  return status === "active"
}) 
      .filter((s) => {
        const next = new Date(s.nextPaymentDate)
        return next >= today
      })
      .map((s) => ({
        name: s.name,
        date: new Date(s.nextPaymentDate).toLocaleDateString(),
        amount: s.cost,
      }))
  }, [subscriptions])

  const categoryData = Object.entries(stats.categories).map(
    ([name, value]) => ({
      name,
      value,
    })
  )

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/60">
          Gain insights into your subscription spending
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlySpending)}
            </div>
            <p className="text-white/50 text-sm">
              Across {stats.activeCount} subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.yearlySpending)}
            </div>
            <p className="text-white/50 text-sm">
              Estimated annual cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeCount}
            </div>
            <p className="text-white/50 text-sm">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={upcoming}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsContent />
    </DashboardLayout>
  )
}