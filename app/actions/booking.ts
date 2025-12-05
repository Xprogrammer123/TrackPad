"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { bookingSchema } from "@/lib/validations"
import { sendWhatsAppNotification } from "@/lib/whatsapp"

interface BookCarInput {
  carId: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  startDate: string
  endDate: string
  totalPrice: number
}

export async function bookCar(input: BookCarInput) {
  const supabase = await createClient()

  // Validate input
  const validationResult = bookingSchema.safeParse({
    carId: input.carId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    startDate: input.startDate,
    endDate: input.endDate,
  })

  if (!validationResult.success) {
    return { error: validationResult.error.errors[0].message }
  }

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to book a car" }
  }

  // Check if car exists and is available
  const { data: car, error: carError } = await supabase.from("cars").select("*").eq("id", input.carId).single()

  if (carError || !car) {
    return { error: "Car not found" }
  }

  if (car.is_booked) {
    return { error: "This car is already booked" }
  }

  // Create booking
  const { error: bookingError } = await supabase.from("bookings").insert({
    car_id: input.carId,
    user_id: input.userId,
    start_date: input.startDate,
    end_date: input.endDate,
    total_price: input.totalPrice,
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    customer_phone: input.customerPhone,
  })

  if (bookingError) {
    console.error("Booking error:", bookingError)
    return { error: "Failed to create booking" }
  }

  // Update car status
  const { error: updateError } = await supabase.from("cars").update({ is_booked: true }).eq("id", input.carId)

  if (updateError) {
    console.error("Update car error:", updateError)
    return { error: "Failed to update car status" }
  }

  await sendWhatsAppNotification({
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    carName: car.name,
    carBrand: car.brand,
    startDate: input.startDate,
    endDate: input.endDate,
    totalPrice: input.totalPrice,
  })

  revalidatePath("/cars")
  revalidatePath("/dashboard")
  revalidatePath("/admin")

  return { success: true }
}
