"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { Car } from "@/lib/types"
import { bookingSchema, type BookingFormData } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { bookCar } from "@/app/actions/booking"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface BookingModalProps {
  car: Car | null
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ car, isOpen, onClose }: BookingModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      carId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      startDate: "",
      endDate: "",
    },
  })

  const startDate = watch("startDate")
  const endDate = watch("endDate")

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser({ id: user.id, email: user.email || "" })
        setValue("customerEmail", user.email || "")
      }
    }

    getUser()
  }, [setValue])

  useEffect(() => {
    if (car) {
      setValue("carId", car.id)
    }
  }, [car, setValue])

  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      if (days > 0) {
        setTotalPrice(days * car.price_per_day)
      } else {
        setTotalPrice(0)
      }
    }
  }, [startDate, endDate, car])

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast.error("Please login to book a car")
      router.push("/auth/login")
      return
    }

    if (!car) return

    setIsSubmitting(true)
    try {
      const result = await bookCar({
        ...data,
        userId: user.id,
        totalPrice,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Booking confirmed! Admin has been notified via WhatsApp.")

        reset()
        onClose()
        router.refresh()
      }
    } catch {
      toast.error("Failed to book car. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!car) return null

  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Book {car.brand} {car.name}
          </DialogTitle>
          <DialogDescription>₦{car.price_per_day}/day - Fill in your details to complete the booking</DialogDescription>
        </DialogHeader>

        {!user && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              Please{" "}
              <a href="/auth/login" className="font-medium underline">
                login
              </a>{" "}
              or{" "}
              <a href="/auth/sign-up" className="font-medium underline">
                sign up
              </a>{" "}
              to book this car.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("carId")} />

          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <Input id="customerName" placeholder="John Doe" {...register("customerName")} />
            {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input id="customerEmail" type="email" placeholder="john@example.com" {...register("customerEmail")} />
            {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input id="customerPhone" type="tel" placeholder="+1 (555) 000-0000" {...register("customerPhone")} />
            {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" min={today} {...register("startDate")} />
              {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" min={startDate || today} {...register("endDate")} />
              {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          {totalPrice > 0 && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Price</span>
                <span className="text-2xl font-bold">₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting || !user}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
