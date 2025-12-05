"use client"

import { motion } from "framer-motion"
import type { Car } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CarCardProps {
  car: Car
  onBookNow: (car: Car) => void
}

export function CarCard({ car, onBookNow }: CarCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="group overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={car.image_url || "/placeholder.svg?height=300&width=400&query=car"}
            alt={`${car.brand} ${car.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {car.is_booked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Badge variant="secondary" className="text-sm">
                Currently Booked
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{car.name}</h3>
              <p className="text-sm text-muted-foreground">{car.brand}</p>
            </div>
            <Badge variant="outline">{car.brand}</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div>
            <span className="text-2xl font-bold">₦{car.price_per_day.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Button
            onClick={() => onBookNow(car)}
            disabled={car.is_booked}
            variant={car.is_booked ? "secondary" : "default"}
          >
            {car.is_booked ? "Booked" : "Book Now"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
