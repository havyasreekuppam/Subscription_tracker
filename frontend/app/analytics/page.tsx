'use client'

import { useMemo } from 'react'
import { TrendingUp, PieChart, Layers, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DashboardLayout } from '@/components/dashboard-layout'
import { SubscriptionProvider, useSubscriptions } from '@/lib/subscription-context'
import { monthlySpending as mockMonthlySpending } from '@/lib/data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

function AnalyticsContent() {
  const { subscriptions } = useSubscriptions()

  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
    const monthlySpending = activeSubscriptions.reduce((acc, sub) => {
      if (sub.billingCycle === 'monthly') {
        return acc + sub.price
      }
      return acc + sub.price / 12
    }, 0)

    const avgCost = activeSubscriptions.length > 0
      ? monthlySpending / activeSubscriptions.length
      : 0

    const categories = [...new Set(subscriptions.map(s => s.category))]

    return {
      monthlySpending,
      avgCost,
      categoryCount: categories.length,
    }
  }, [subscriptions])

  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>()

    subscriptions
      .filter(s => s.status === 'active')
      .forEach((sub) => {
        const monthlyAmount = sub.billingCycle === 'monthly' ? sub.price : sub.price / 12
        const current = categoryMap.get(sub.category) || 0
        categoryMap.set(sub.category, current + monthlyAmount)
      })

    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value: Number(value.toFixed(2)),
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [subscriptions])

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/60">Insights into your subscription spending</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">
              Total Monthly Spending
            </CardTitle>
            <DollarSign className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-white">
              ${stats.monthlySpending.toFixed(2)}
            </div>
            <p className="text-xs text-white/50">
              Across all active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">
              Average Subscription Cost
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-white">
              ${stats.avgCost.toFixed(2)}
            </div>
            <p className="text-xs text-white/50">
              Per subscription monthly
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">
              Number of Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-white">
              {stats.categoryCount}
            </div>
            <p className="text-xs text-white/50">
              Different categories tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart - Monthly Spending Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-white">Spending Trend</CardTitle>
            </div>
            <CardDescription>Monthly spending over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockMonthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spending']}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Category Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle className="text-white">Category Distribution</CardTitle>
            </div>
            <CardDescription>Spending breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Monthly']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-white/70">{value}</span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Category Breakdown</CardTitle>
          <CardDescription>Detailed spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category, index) => {
              const percentage = (category.value / stats.monthlySpending) * 100
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-white/70">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-foreground">
                        ${category.value.toFixed(2)}
                      </span>
                      <span className="ml-2 text-xs text-white/50">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <SubscriptionProvider>
      <DashboardLayout>
        <AnalyticsContent />
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
