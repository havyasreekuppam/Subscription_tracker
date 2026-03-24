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
import Image from 'next/image'

const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
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

  // ✅ FIX 1: Restore Icon
  const Icon = iconMap[subscription.icon] || Code

  // ✅ Logo mapping


  // ✅ FIX 2: Smart logo detection

  const getLogoUrl = (name: string) => {
    const knownDomains: Record<string, string> = {
      github: 'github.com',
      adobe: 'adobe.com',
      figma: 'figma.com',
      spotify: 'spotify.com',
      netflix: 'netflix.com',
      leetcode: 'leetcode.com',
    }

    const key = Object.keys(knownDomains).find(k =>
      name.toLowerCase().includes(k)
    )

    if (key) {
      return `https://logo.clearbit.com/${knownDomains[key]}`
    }

    // fallback (auto-generate)
    const domain = name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')

    return `https://logo.clearbit.com/${domain}.com`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const daysUntil = getDaysUntil(subscription.nextBillingDate)
  const isUrgent = daysUntil <= 3 && daysUntil >= 0

  // 🔹 COMPACT VERSION
  if (compact) {
    return (
      <div
        className="flex items-center justify-between py-3 px-4 rounded-lg
        bg-white/[0.03] backdrop-blur-xl border border-white/10
        hover:bg-white/[0.06] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${subscription.color}10` }}
          >
            <Icon className="h-4 w-4" style={{ color: subscription.color }} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {subscription.name}
            </p>
            <p className="text-xs text-white/60">
              {formatDate(subscription.nextBillingDate)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-white">
            ${subscription.price.toFixed(2)}
          </p>

          {isUrgent && (
            <Badge className="text-[10px] px-1.5 py-0 bg-red-500 text-white">
              {daysUntil === 0 ? 'Today' : `${daysUntil}d`}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  // 🔹 FULL CARD VERSION
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl
      bg-white/[0.02] backdrop-blur-xl border border-white/10
      hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${subscription.color}08` }}
        >
          {(() => {
            const logoUrl = getLogoUrl(subscription.name)

            return (
              <Image
                src={logoUrl}
                alt={subscription.name}
                width={24}
                height={24}
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'

                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<span style="color: ${subscription.color}; font-size: 12px; font-weight: bold;">
            ${subscription.name.slice(0, 2).toUpperCase()}
          </span>`
                  }
                }}
              />
            )
          })()}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-white">
              {subscription.name}
            </p>

            <Badge
              className={cn(
                'text-[10px] px-1.5 py-0 text-white',
                subscription.status === 'active'
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              )}
            >
              {subscription.status}
            </Badge>
          </div>

          <p className="text-sm text-white/60">
            {subscription.category}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-white">
            ${subscription.price.toFixed(2)}/
            {subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
          </p>

          <p className="text-xs text-white/60">
            Next: {formatDate(subscription.nextBillingDate)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white/10 backdrop-blur-xl border border-white/10 text-white"
          >
            <DropdownMenuItem onClick={() => onEdit?.(subscription)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete?.(subscription.id)}
              className="text-red-400"
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