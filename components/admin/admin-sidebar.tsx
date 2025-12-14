"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { LayoutDashboard, Car, Calendar, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AdminSidebarProps {
  availableCarsCount: number
  bookedCarsCount: number
}

const navItems = [
  { view: "overview", label: "Overview", icon: LayoutDashboard, key: "overview" },
  { view: "available", label: "Available Cars", icon: Car, key: "available" },
  { view: "booked", label: "Booked Cars", icon: Calendar, key: "booked" },
  { view: "add-car", label: "Add New Car", icon: Plus, key: "add-car" },
]

export function AdminSidebar({ availableCarsCount, bookedCarsCount }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Get current view from URL search params
  const currentView = searchParams?.get("view") || "overview"

  const handleNavigation = (view: string) => {
    router.push(`/admin?view=${view}`)
    setIsMobileMenuOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.key
          const count = item.key === "available" ? availableCarsCount : item.key === "booked" ? bookedCarsCount : null

          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.view)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {count !== null && (
                <span className={cn("rounded-full px-2 py-0.5 text-xs", isActive ? "bg-primary-foreground/20" : "bg-muted")}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-20 left-4 z-40 shadow-lg"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-16 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent className="max-w-xs p-0 sm:max-w-xs" showCloseButton={false}>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-6">
              <DialogTitle className="text-lg font-semibold">Admin Panel</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentView === item.key
                  const count = item.key === "available" ? availableCarsCount : item.key === "booked" ? bookedCarsCount : null

                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavigation(item.view)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {count !== null && (
                        <span className={cn("rounded-full px-2 py-0.5 text-xs", isActive ? "bg-primary-foreground/20" : "bg-muted")}>
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

