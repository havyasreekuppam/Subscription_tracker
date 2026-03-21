'use client'

import { Bell, Check, CreditCard, AlertTriangle, Info, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/dashboard-layout'
import { SubscriptionProvider, useSubscriptions } from '@/lib/subscription-context'
import { Empty } from '@/components/ui/empty'
import { cn } from '@/lib/utils'

function NotificationsContent() {
  const { notifications, markNotificationAsRead, clearAllNotifications, unreadCount } = useSubscriptions()

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return CreditCard
      case 'alert':
        return AlertTriangle
      case 'info':
        return Info
      default:
        return Bell
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-primary bg-primary/10'
      case 'alert':
        return 'text-warning bg-warning/10'
      case 'info':
        return 'text-muted-foreground bg-muted'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your subscription alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={clearAllNotifications} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payment Reminders
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {notifications.filter(n => n.type === 'payment').length}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming payments</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {notifications.filter(n => n.type === 'alert').length}
            </div>
            <p className="text-xs text-muted-foreground">Important alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                      notification.read
                        ? 'bg-card border-border'
                        : 'bg-primary/5 border-primary/20'
                    )}
                  >
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', getIconColor(notification.type))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn(
                            'text-sm',
                            notification.read ? 'font-medium' : 'font-semibold'
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Empty
              title="No notifications"
              description="You're all caught up!"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <SubscriptionProvider>
      <DashboardLayout>
        <NotificationsContent />
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
