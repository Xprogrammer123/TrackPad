import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AdminStats } from "@/components/admin/admin-stats"
import { CombinedBookingsChart } from "@/components/admin/combined-bookings-chart"
import { BookedCarsTable } from "@/components/admin/booked-cars-table"
import { AvailableCarsTable } from "@/components/admin/available-cars-table"
import { AddCarForm } from "@/components/admin/add-car-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { syncCarBookingStatus } from "@/app/actions/admin"

export const metadata = {
  title: "Admin Dashboard - TrackPad",
  description: "Manage cars, bookings, and view analytics",
}

export default async function AdminPage() {
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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Get unique brands
  const brands = [...new Set(bookings?.map((b) => b.car?.brand).filter(Boolean))] as string[]

  // Initialize chart data with all months
  const combinedChartData = months.map((month) => {
    const monthBookings =
      bookings?.filter((b) => {
        const bookingMonth = new Date(b.created_at).toLocaleString("default", { month: "short" })
        return bookingMonth === month
      }) || []

    const dataPoint: Record<string, string | number> = { month, totalBookings: monthBookings.length }

    // Add brand counts
    brands.forEach((brand) => {
      dataPoint[brand] = monthBookings.filter((b) => b.car?.brand === brand).length
    })

    return dataPoint
  })

  // Get currently booked cars with customer info (only active bookings)
  const bookedCarsWithCustomers = activeBookings

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
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

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="available">Available Cars ({availableCars.length})</TabsTrigger>
              <TabsTrigger value="booked">Booked Cars ({bookedCarsList.length})</TabsTrigger>
              <TabsTrigger value="add-car">Add New Car</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <CombinedBookingsChart data={combinedChartData} brands={brands} />
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <AvailableCarsTable cars={availableCars} />
            </TabsContent>

            <TabsContent value="booked" className="mt-6">
              <BookedCarsTable bookings={bookedCarsWithCustomers} cars={bookedCarsList} />
            </TabsContent>

            <TabsContent value="add-car" className="mt-6">
              <AddCarForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
