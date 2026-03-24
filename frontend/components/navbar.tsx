'use client'

import { Bell, Menu, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSubscriptions } from '@/lib/subscription-context'
import Link from 'next/link'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { unreadCount } = useSubscriptions()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between 
    border-b border-white/10 
    bg-white/10 backdrop-blur-xl 
    shadow-lg px-4 lg:px-6">

      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-white/10"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>

        <h1 className="text-lg font-semibold text-white tracking-tight hidden sm:block">
          Subscription Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <Link href="/notifications">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-white/10"
          >
            <Bell className="h-5 w-5 text-white" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center 
              rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
              text-[10px] font-medium text-white shadow-md">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-2 hover:bg-white/10 rounded-xl"
            >
              <Avatar className="h-8 w-8 ring-2 ring-white/20">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="hidden flex-col items-start text-sm md:flex text-white">
                <span className="font-medium">John Doe</span>
                <span className="text-xs text-white/60">john@example.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* Dropdown */}
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-xl"
          >
            <DropdownMenuLabel className="text-white/70">
              My Account
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-white/10"/>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10"/>

            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}