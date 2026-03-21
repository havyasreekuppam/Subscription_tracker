import type { Subscription, Notification, CategorySpending, MonthlySpending } from './types'

export const subscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    icon: 'tv',
    category: 'Entertainment',
    price: 15.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-03-25',
    status: 'active',
    color: '#E50914'
  },
  {
    id: '2',
    name: 'Spotify',
    icon: 'music',
    category: 'Entertainment',
    price: 9.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-03-22',
    status: 'active',
    color: '#1DB954'
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    icon: 'palette',
    category: 'Software',
    price: 54.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-03-28',
    status: 'active',
    color: '#FF0000'
  },
  {
    id: '4',
    name: 'GitHub Pro',
    icon: 'code',
    category: 'Development',
    price: 4.00,
    billingCycle: 'monthly',
    nextBillingDate: '2026-03-30',
    status: 'active',
    color: '#333333'
  },
  {
    id: '5',
    name: 'Figma',
    icon: 'figma',
    category: 'Design',
    price: 15.00,
    billingCycle: 'monthly',
    nextBillingDate: '2026-04-01',
    status: 'active',
    color: '#F24E1E'
  },
  {
    id: '6',
    name: 'AWS',
    icon: 'cloud',
    category: 'Cloud',
    price: 120.00,
    billingCycle: 'monthly',
    nextBillingDate: '2026-04-05',
    status: 'active',
    color: '#FF9900'
  },
  {
    id: '7',
    name: 'Notion',
    icon: 'book-open',
    category: 'Productivity',
    price: 96.00,
    billingCycle: 'yearly',
    nextBillingDate: '2026-06-15',
    status: 'active',
    color: '#000000'
  },
  {
    id: '8',
    name: 'Slack',
    icon: 'message-square',
    category: 'Communication',
    price: 8.75,
    billingCycle: 'monthly',
    nextBillingDate: '2026-03-21',
    status: 'active',
    color: '#4A154B'
  },
  {
    id: '9',
    name: 'Disney+',
    icon: 'tv',
    category: 'Entertainment',
    price: 13.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-04-10',
    status: 'paused',
    color: '#0063e5'
  },
]

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Slack payment due tomorrow',
    description: 'Your Slack subscription of $8.75 is due on March 21, 2026.',
    timestamp: '2026-03-20T10:00:00',
    read: false,
    type: 'payment'
  },
  {
    id: '2',
    title: 'Spotify payment due in 2 days',
    description: 'Your Spotify subscription of $9.99 is due on March 22, 2026.',
    timestamp: '2026-03-20T09:00:00',
    read: false,
    type: 'payment'
  },
  {
    id: '3',
    title: 'Netflix payment due in 5 days',
    description: 'Your Netflix subscription of $15.99 is due on March 25, 2026.',
    timestamp: '2026-03-19T14:30:00',
    read: true,
    type: 'payment'
  },
  {
    id: '4',
    title: 'Adobe price increase alert',
    description: 'Adobe Creative Cloud is increasing prices by 5% starting next month.',
    timestamp: '2026-03-18T11:00:00',
    read: true,
    type: 'alert'
  },
  {
    id: '5',
    title: 'New feature: Category insights',
    description: 'Check out our new category spending insights in the Analytics section.',
    timestamp: '2026-03-15T09:00:00',
    read: true,
    type: 'info'
  },
]

export const categorySpending: CategorySpending[] = [
  { name: 'Entertainment', value: 39.97, color: '#3b82f6' },
  { name: 'Software', value: 54.99, color: '#8b5cf6' },
  { name: 'Development', value: 4.00, color: '#10b981' },
  { name: 'Design', value: 15.00, color: '#f59e0b' },
  { name: 'Cloud', value: 120.00, color: '#ef4444' },
  { name: 'Productivity', value: 8.00, color: '#06b6d4' },
  { name: 'Communication', value: 8.75, color: '#ec4899' },
]

export const monthlySpending: MonthlySpending[] = [
  { month: 'Oct', amount: 215.50 },
  { month: 'Nov', amount: 228.72 },
  { month: 'Dec', amount: 242.15 },
  { month: 'Jan', amount: 235.90 },
  { month: 'Feb', amount: 248.71 },
  { month: 'Mar', amount: 250.71 },
]

export const categories = [
  'Entertainment',
  'Software',
  'Development',
  'Design',
  'Cloud',
  'Productivity',
  'Communication',
  'Other'
]
