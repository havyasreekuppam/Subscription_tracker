export interface Subscription {
  id: string
  name: string
  icon: string
  category: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  status: 'active' | 'paused' | 'expired'
  color: string
}

export interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  type: 'payment' | 'alert' | 'info'
}

export interface CategorySpending {
  name: string
  value: number
  color: string
}

export interface MonthlySpending {
  month: string
  amount: number
}
