"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Clock, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-full w-[60%] opacity-60"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--muted)) 1px, transparent 1px),
                              linear-gradient(to bottom, hsl(var(--muted)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center border bg-background px-4 py-1.5 text-sm"
              >
                <span className="mr-2 bg-primary px-2 py-0.5 text-xs text-primary-foreground">New</span>
                Premium vehicles available
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                Your Journey Starts with <span className="text-primary">Trackpad Services</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground text-pretty">
                Experience premium car rentals with unmatched flexibility. From economy to luxury, find the perfect
                vehicle for every adventure.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/cars">
                <Button size="lg" className="gap-2">
                  Browse Cars <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm">Multiple Locations</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 p-8">
              <img
                src="/luxury-car-side-view-sleek-modern.jpg"
                alt="Luxury car"
                className="h-full w-full object-cover shadow-2xl"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 border bg-background p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center bg-primary/10">
                  <span className="text-2xl font-bold text-primary">50+</span>
                </div>
                <div>
                  <p className="font-semibold">Vehicles</p>
                  <p className="text-sm text-muted-foreground">Ready to rent</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
