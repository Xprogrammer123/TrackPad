import { createClient } from "@/lib/supabase/server"
import { AvailableCarsTable } from "@/components/admin/available-cars-table"

export const metadata = {
  title: "Available Cars - Admin - TrackPad",
  description: "Manage available cars in your fleet",
}

export default async function AvailableCarsPage() {
  const supabase = await createClient()

  // Fetch all cars
  const { data: cars } = await supabase.from("cars").select("*").order("created_at", { ascending: false })

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  // Fetch all bookings to determine active bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("car_id, end_date")
    .gte("end_date", today.toISOString().split("T")[0])

  // Get car IDs that have active bookings
  const carsWithActiveBookings = new Set(bookings?.map((b) => b.car_id) || [])

  // Filter cars based on active bookings (not just is_booked flag)
  const availableCars = cars?.filter((c) => !carsWithActiveBookings.has(c.id)) || []

  return (
    <div className="mt-8">
      <AvailableCarsTable cars={availableCars} />
    </div>
  )
}

