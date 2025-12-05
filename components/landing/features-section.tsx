"use client"

import { motion } from "framer-motion"
import { Car, CreditCard, Calendar, Headphones } from "lucide-react"

const features = [
  {
    icon: Car,
    title: "Wide Selection",
    description: "Choose from economy cars to luxury vehicles. We have the perfect car for every need and budget.",
  },
  {
    icon: CreditCard,
    title: "Easy Booking",
    description: "Book your car in minutes with our simple online process. No hidden fees, transparent pricing.",
  },
  {
    icon: Calendar,
    title: "Flexible Rentals",
    description: "Rent by the day, week, or month. Extend or modify your booking anytime with ease.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you with any questions.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Choose Trackpad Services?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We provide the best car rental experience with premium vehicles and exceptional service.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 inline-flex bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
