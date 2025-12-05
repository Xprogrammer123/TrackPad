"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Calendar, DollarSign, TrendingUp } from "lucide-react"

interface AdminStatsProps {
  totalCars: number
  bookedCars: number
  totalRevenue: number
  totalBookings: number
}

export function AdminStats({ totalCars, bookedCars, totalRevenue, totalBookings }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Cars",
      value: totalCars,
      icon: Car,
      description: "In fleet",
    },
    {
      title: "Booked Cars",
      value: bookedCars,
      icon: Calendar,
      description: "Currently rented",
    },
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "All time earnings",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: TrendingUp,
      description: "All time",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
