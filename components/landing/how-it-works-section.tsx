"use client"

import { motion } from "framer-motion"
import { Search, CalendarCheck, Key } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Select",
    description: "Explore our wide range of vehicles and find the perfect car that fits your needs.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book Online",
    description: "Choose your dates, fill in your details, and complete your booking in just a few clicks.",
  },
  {
    icon: Key,
    step: "03",
    title: "Pick Up & Drive",
    description: "Collect your car at the scheduled time and enjoy your journey with complete peace of mind.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-muted/50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Renting a car has never been easier. Follow these simple steps to get started.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 bg-primary/10" />
                <step.icon className="relative h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
