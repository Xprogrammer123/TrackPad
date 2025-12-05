"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Car, DollarSign, Calendar } from "lucide-react"

interface DashboardStatsProps {
  totalBookings: number
  totalSpent: number
  activeBookings: number
}

export function DashboardStats({ totalBookings, totalSpent, activeBookings }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Car,
      description: "All time rentals",
    },
    {
      title: "Total Spent",
      value: `₦${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      description: "All time spending",
    },
    {
      title: "Active Rentals",
      value: activeBookings,
      icon: Calendar,
      description: "Currently active",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
