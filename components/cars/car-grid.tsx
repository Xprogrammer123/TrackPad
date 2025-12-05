"use client"

import { useState } from "react"
import type { Car } from "@/lib/types"
import { CarCard } from "./car-card"
import { BookingModal } from "./booking-modal"

interface CarGridProps {
  cars: Car[]
}

export function CarGrid({ cars }: CarGridProps) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBookNow = (car: Car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCar(null)
  }

  if (cars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No cars available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} onBookNow={handleBookNow} />
        ))}
      </div>
      <BookingModal car={selectedCar} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
