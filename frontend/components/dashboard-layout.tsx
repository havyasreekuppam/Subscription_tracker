'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
