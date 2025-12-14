import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminStats } from "@/components/admin/admin-stats"
import { syncCarBookingStatus } from "@/app/actions/admin"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.is_admin === true
  if (!isAdmin) {
    redirect("/")
  }

  // Sync car booking status - update cars whose bookings have expired
  await syncCarBookingStatus()

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

  // Calculate stats
  const totalCars = cars?.length || 0
  // Count booked cars based on active bookings, not just is_booked flag
  const bookedCars = activeBookings.length > 0 ? new Set(activeBookings.map((b) => b.car_id)).size : 0
  const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0
  const totalBookings = bookings?.length || 0

  // Get car IDs that have active bookings
  const carsWithActiveBookings = new Set(activeBookings.map((b) => b.car_id))

  // Filter cars based on active bookings (not just is_booked flag)
  const availableCars = cars?.filter((c) => !carsWithActiveBookings.has(c.id)) || []
  const bookedCarsList = cars?.filter((c) => carsWithActiveBookings.has(c.id)) || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 pt-16 lg:pt-0">
        <AdminSidebar availableCarsCount={availableCars.length} bookedCarsCount={bookedCarsList.length} />
        <main className="flex-1 bg-muted/30 lg:ml-64">
          <div className="container mx-auto px-4 py-8 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Manage your fleet and monitor bookings</p>
            </div>

            <AdminStats
              totalCars={totalCars}
              bookedCars={bookedCars}
              totalRevenue={totalRevenue}
              totalBookings={totalBookings}
            />

            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

