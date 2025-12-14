import { createClient } from "@/lib/supabase/server"
import { CombinedBookingsChart } from "@/components/admin/combined-bookings-chart"

export const metadata = {
  title: "Admin Overview - TrackPad",
  description: "View analytics and booking charts",
}

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Fetch all bookings with car details (admin can see all)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      car:cars(*)
    `)
    .order("created_at", { ascending: false })

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

  return (
    <div className="mt-8">
      <CombinedBookingsChart data={combinedChartData} brands={brands} />
    </div>
  )
}
