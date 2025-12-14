"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { carSchema } from "@/lib/validations"

interface AddCarInput {
  name: string
  brand: string
  pricePerDay: number
  imageUrl?: string
}

export async function addCar(input: AddCarInput) {
  const supabase = await createClient()

  // Validate input
  const validationResult = carSchema.safeParse(input)
  if (!validationResult.success) {
    return { error: validationResult.error.errors[0].message }
  }

  // Verify user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to add a car" }
  }

  const isAdmin = user.user_metadata?.is_admin === true
  if (!isAdmin) {
    return { error: "You must be an admin to add cars" }
  }

  // Insert car
  const { error: insertError } = await supabase.from("cars").insert({
    name: input.name,
    brand: input.brand,
    price_per_day: input.pricePerDay,
    image_url: input.imageUrl || null,
    is_booked: false,
  })

  if (insertError) {
    console.error("Insert car error:", insertError)
    return { error: "Failed to add car" }
  }

  revalidatePath("/cars")
  revalidatePath("/admin")

  return { success: true }
}


export async function syncCarBookingStatus() {
  const supabase = await createClient()

  // Get all cars marked as booked
  const { data: bookedCars, error: carsError } = await supabase
    .from("cars")
    .select("id")
    .eq("is_booked", true)

  if (carsError || !bookedCars) {
    console.error("Error fetching booked cars:", carsError)
    return { error: "Failed to fetch booked cars" }
  }

  if (bookedCars.length === 0) {
    return { success: true, updated: 0 }
  }

  const carIds = bookedCars.map((c) => c.id)
  const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

  // Get all active bookings (end_date >= today) for these cars
  const { data: activeBookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("car_id")
    .in("car_id", carIds)
    .gte("end_date", today)

  if (bookingsError) {
    console.error("Error fetching active bookings:", bookingsError)
    return { error: "Failed to fetch active bookings" }
  }

  // Get car IDs that have active bookings
  const carsWithActiveBookings = new Set(activeBookings?.map((b) => b.car_id) || [])

  // Find cars that are marked as booked but have no active bookings
  const carsToUnbook = carIds.filter((carId) => !carsWithActiveBookings.has(carId))

  if (carsToUnbook.length === 0) {
    return { success: true, updated: 0 }
  }

  // Update these cars to be available
  const { error: updateError } = await supabase
    .from("cars")
    .update({ is_booked: false })
    .in("id", carsToUnbook)

  if (updateError) {
    console.error("Error updating car status:", updateError)
    return { error: "Failed to update car status" }
  }

  return { success: true, updated: carsToUnbook.length }
}

export async function unbookCar(carId: string, bookingId: string) {
  const supabase = await createClient()

  // Verify user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to unbook a car" }
  }

  const isAdmin = user.user_metadata?.is_admin === true
  if (!isAdmin) {
    return { error: "You must be an admin to unbook cars" }
  }

  // Update car to be available
  const { error: carError } = await supabase.from("cars").update({ is_booked: false }).eq("id", carId)

  if (carError) {
    console.error("Unbook car error:", carError)
    return { error: "Failed to update car status" }
  }

  // Delete the booking
  const { error: bookingError } = await supabase.from("bookings").delete().eq("id", bookingId)

  if (bookingError) {
    console.error("Delete booking error:", bookingError)
    return { error: "Failed to delete booking" }
  }

  revalidatePath("/cars")
  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true }
}
