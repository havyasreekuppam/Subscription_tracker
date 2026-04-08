export interface Subscription {
  id: string
  _id?: string

  name: string
  icon?: string

  category: string

  cost: number // ✅ FIXED (was price)

  billingCycle: 'monthly' | 'yearly'

  nextPaymentDate: string // ✅ FIXED (was nextBillingDate)

  color?: string

  status?: string // ✅ already correct
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
