'use client'

import {
  Tv,
  Music,
  Palette,
  Code,
  Cloud,
  BookOpen,
  MessageSquare,
  Figma,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Subscription } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tv: Tv,
  music: Music,
  palette: Palette,
  code: Code,
  cloud: Cloud,
  'book-open': BookOpen,
  'message-square': MessageSquare,
  figma: Figma,
}

interface SubscriptionItemProps {
  subscription: Subscription
  onEdit?: (subscription: Subscription) => void
  onDelete?: (id: string) => void
  compact?: boolean
}

export function SubscriptionItem({
  subscription,
  onEdit,
  onDelete,
  compact = false,
}: SubscriptionItemProps) {
  const Icon = iconMap[subscription.icon] || Code
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntil = getDaysUntil(subscription.nextBillingDate)
  const isUrgent = daysUntil <= 3 && daysUntil >= 0

  if (compact) {
    return (
      <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${subscription.color}15` }}
          >
            <Icon className="h-4 w-4" style={{ color: subscription.color }} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{subscription.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(subscription.nextBillingDate)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            ${subscription.price.toFixed(2)}
          </p>
          {isUrgent && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {daysUntil === 0 ? 'Today' : `${daysUntil}d`}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${subscription.color}15` }}
        >
          <Icon className="h-6 w-6" style={{ color: subscription.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">{subscription.name}</p>
            <Badge
              variant={subscription.status === 'active' ? 'default' : 'secondary'}
              className={cn(
                'text-[10px] px-1.5 py-0',
                subscription.status === 'active' && 'bg-success text-success-foreground'
              )}
            >
              {subscription.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{subscription.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-foreground">
            ${subscription.price.toFixed(2)}/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
          </p>
          <p className="text-xs text-muted-foreground">
            Next: {formatDate(subscription.nextBillingDate)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(subscription)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(subscription.id)}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
