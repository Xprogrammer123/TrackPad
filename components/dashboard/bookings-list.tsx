"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import type { Booking, Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/cars/booking-modal"
import { Calendar } from "lucide-react"

interface BookingsListProps {
  bookings: (Booking & { car: Car })[]
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRebook = (car: Car) => {
    if (!car.is_booked) {
      setSelectedCar(car)
      setIsModalOpen(true)
    }
  }

  const getBookingStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < now) return { label: "Completed", variant: "secondary" as const }
    if (start <= now && end >= now) return { label: "Active", variant: "default" as const }
    return { label: "Upcoming", variant: "outline" as const }
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No bookings yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Browse our available cars and make your first booking.</p>
          <Button className="mt-4" asChild>
            <a href="/cars">Browse Cars</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking, index) => {
          const status = getBookingStatus(booking.start_date, booking.end_date)
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={
                          booking.car?.image_url ||
                          "/placeholder.svg?height=100&width=150&query=car" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={`${booking.car?.brand} ${booking.car?.name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">
                            {booking.car?.brand} {booking.car?.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(booking.start_date), "MMM d, yyyy")} -{" "}
                              {format(new Date(booking.end_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p className="font-semibold">₦{Number(booking.total_price).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Booked</p>
                            <p className="text-sm">{format(new Date(booking.created_at), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        {status.label === "Completed" && booking.car && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRebook(booking.car)}
                            disabled={booking.car.is_booked}
                          >
                            {booking.car.is_booked ? "Currently Booked" : "Rebook"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
      <BookingModal
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCar(null)
        }}
      />
    </>
  )
}
