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
    <div className="flex min-h-screen relative overflow-hidden bg-[#070a12] font-[Arial]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#070a12] to-[#05070d]" />

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] 
  bg-[#5a6cff] opacity-30 blur-[140px] rounded-full" />

      {/* LIGHT BEAM */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[500px]
  bg-gradient-to-b from-[#7b8cff]/50 to-transparent blur-2xl" />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="flex flex-1 z-10">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col lg:ml-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
