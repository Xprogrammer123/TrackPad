import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CarGrid } from "@/components/cars/car-grid"

export const metadata = {
  title: "Available Cars - TrackPad",
  description: "Browse our selection of premium rental vehicles",
}

export default async function CarsPage() {
  const supabase = await createClient()

  const { data: cars, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cars:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Available Cars</h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Choose from our selection of premium vehicles. All cars come with full insurance and 24/7 roadside
                assistance.
              </p>
            </div>
            <CarGrid cars={cars || []} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
