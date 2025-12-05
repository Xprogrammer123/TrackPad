import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BookingsList } from "@/components/dashboard/bookings-list"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export const metadata = {
  title: "Dashboard - TrackPad",
  description: "View and manage your car rental bookings",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch user's bookings with car details
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(`
      *,
      car:cars(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError)
  }

  // Calculate stats
  const totalBookings = bookings?.length || 0
  const totalSpent = bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0
  const activeBookings =
    bookings?.filter((b) => {
      const endDate = new Date(b.end_date)
      return endDate >= new Date()
    }).length || 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Welcome back, {user.email}</p>
          </div>

          <DashboardStats totalBookings={totalBookings} totalSpent={totalSpent} activeBookings={activeBookings} />

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">My Bookings</h2>
            <BookingsList bookings={bookings || []} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
