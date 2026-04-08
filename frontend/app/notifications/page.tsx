'use client'

import { Bell, Check, CreditCard, AlertTriangle, Info, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useSubscriptions } from '@/lib/subscription-context'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { cn } from '@/lib/utils'

function NotificationsContent() {
  const { unreadCount } = useSubscriptions()
  const notifications: any[] = []

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
        return 'text-primary'
      case 'alert':
        return 'text-yellow-400'
      case 'info':
        return 'text-blue-400'
      default:
        return 'text-white/70'
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-white/60">Stay updated with your subscription alerts</p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            
            className="gap-2 border-white/20 text-white hover:bg-white/10"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-white/60 text-sm">Notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'payment').length}
            </div>
            <p className="text-white/60 text-sm">Upcoming payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'alert').length}
            </div>
            <p className="text-white/60 text-sm">Important alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            {notifications.length} notification{notifications.length !== 1 && 's'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type)

                return (
                  <div
                    key={notification.id || Math.random()}
                    className="flex items-start gap-4 rounded-xl border border-white/10 p-4 
bg-white/5 backdrop-blur-xl text-white transition-all hover:bg-white/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      <Icon className={cn('h-5 w-5', getIconColor(notification.type))} />
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

                          <p className="text-sm text-white/60">
                            {notification.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-white/50">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          {!notification.read && (
                            <Badge className="bg-primary text-white text-xs px-2 py-0.5">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-white/70 hover:bg-white/10"
                          
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
            <Empty className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <EmptyHeader>
                <EmptyTitle className="text-white">
                  No notifications
                </EmptyTitle>

                <EmptyDescription className="text-white/40">
                  You're all caught up!
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsContent />
    </DashboardLayout>
  )
}