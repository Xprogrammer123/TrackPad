import { createClient } from "@/lib/supabase/server"
import { BookedCarsTable } from "@/components/admin/booked-cars-table"

export const metadata = {
  title: "Booked Cars - Admin - TrackPad",
  description: "View and manage booked cars",
}

export default async function BookedCarsPage() {
  const supabase = await createClient()

  // Fetch all bookings with car details (admin can see all)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      car:cars(*)
    `)
    .order("created_at", { ascending: false })

  // Fetch all cars
  const { data: cars } = await supabase.from("cars").select("*").order("created_at", { ascending: false })

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  // Get active bookings (end_date >= today)
  const activeBookings =
    bookings?.filter((b) => {
      const endDate = new Date(b.end_date)
      endDate.setHours(0, 0, 0, 0)
      return endDate >= today
    }) || []

  // Get car IDs that have active bookings
  const carsWithActiveBookings = new Set(activeBookings.map((b) => b.car_id))

  // Filter cars based on active bookings (not just is_booked flag)
  const bookedCarsList = cars?.filter((c) => carsWithActiveBookings.has(c.id)) || []

  // Get currently booked cars with customer info (only active bookings)
  const bookedCarsWithCustomers = activeBookings

  return (
    <div className="mt-8">
      <BookedCarsTable bookings={bookedCarsWithCustomers} cars={bookedCarsList} />
    </div>
  )
}

