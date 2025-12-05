"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Booking, Car } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { unbookCar } from "@/app/actions/admin"
import { toast } from "sonner"

interface BookedCarsTableProps {
  bookings: (Booking & { car: Car })[]
  cars: Car[]
}

export function BookedCarsTable({ bookings, cars }: BookedCarsTableProps) {
  const [unbookingId, setUnbookingId] = useState<string | null>(null)

  async function handleUnbook(carId: string, bookingId: string) {
    setUnbookingId(bookingId)
    try {
      const result = await unbookCar(carId, bookingId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Car has been unbooked and is now available")
      }
    } catch {
      toast.error("Failed to unbook car")
    } finally {
      setUnbookingId(null)
    }
  }

  if (bookings.length === 0 && cars.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booked Cars</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No booked cars at the moment</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked Cars ({cars.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const isActive = new Date(booking.start_date) <= new Date() && new Date(booking.end_date) >= new Date()
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            booking.car?.image_url ||
                            "/placeholder.svg?height=40&width=60&query=car" ||
                            "/placeholder.svg"
                          }
                          alt={`${booking.car?.brand} ${booking.car?.name}`}
                          className="h-10 w-14 object-cover"
                        />
                        <div>
                          <p className="font-medium">
                            {booking.car?.brand} {booking.car?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">₦{booking.car?.price_per_day}/day</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{booking.customer_name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{booking.customer_email}</p>
                        <p className="text-muted-foreground">{booking.customer_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(booking.start_date), "MMM d, yyyy")}</p>
                        <p className="text-muted-foreground">to {format(new Date(booking.end_date), "MMM d, yyyy")}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">₦{Number(booking.total_price).toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isActive ? "default" : "outline"}>{isActive ? "Active" : "Upcoming"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnbook(booking.car_id, booking.id)}
                        disabled={unbookingId === booking.id}
                      >
                        {unbookingId === booking.id ? "Unbooking..." : "Unbook"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
