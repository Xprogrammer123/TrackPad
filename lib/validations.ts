import { z } from "zod"

export const bookingSchema = z
  .object({
    carId: z.string().uuid("Invalid car ID"),
    customerName: z.string().min(2, "Name must be at least 2 characters"),
    customerEmail: z.string().email("Invalid email address"),
    customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    startDate: z.string().refine((date) => {
      const selected = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, "Start date cannot be in the past"),
    endDate: z.string(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return end > start
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export const carSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  pricePerDay: z.number().min(1, "Price must be at least ₦1"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
})

export type BookingFormData = z.infer<typeof bookingSchema>
export type CarFormData = z.infer<typeof carSchema>
