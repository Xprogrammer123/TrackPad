import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import type { Car } from "@/lib/types"
import { syncCarBookingStatus } from "@/app/actions/admin"

export async function BrowseCarsSection() {
  const supabase = await createClient()
  
  // Sync car booking status to ensure expired bookings are cleared
  await syncCarBookingStatus()
  
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("is_booked", false)
    .limit(12)
    .order("created_at", { ascending: false })

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Available Cars</h2>
            <p className="mt-2 text-muted-foreground">
              Browse our selection of premium vehicles ready for your next journey.
            </p>
          </div>
          <Link href="/cars">
            <Button variant="outline" className="gap-2 bg-transparent">
              View All Cars <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars && cars.length > 0 ? (
            cars.map((car: Car) => (
              <Card key={car.id} className="group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={car.image_url || "/placeholder.svg?height=300&width=400&query=car"}
                    alt={`${car.brand} ${car.name}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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
                  <Link href="/cars">
                    <Button size="sm">Book Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">No cars available at the moment. Check back soon!</p>
              <Link href="/cars" className="mt-4 inline-block">
                <Button variant="outline">Browse All Cars</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
