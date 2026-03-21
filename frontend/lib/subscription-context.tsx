'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Subscription, Notification } from './types'
import { subscriptions as initialSubscriptions, notifications as initialNotifications } from './data'

interface SubscriptionContextType {
  subscriptions: Subscription[]
  notifications: Notification[]
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void
  unreadCount: number
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const addSubscription = useCallback((subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    }
    setSubscriptions(prev => [...prev, newSubscription])
  }, [])

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
    )
  }, [])

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id))
  }, [])

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        notifications,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        markNotificationAsRead,
        clearAllNotifications,
        unreadCount,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider')
  }
  return context
}
