"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { carSchema, type CarFormData } from "@/lib/validations"
import { addCar } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"

export function AddCarForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: "",
      brand: "",
      pricePerDay: 50,
      imageUrl: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        // For now, using a placeholder URL pattern - in production, this would upload to Supabase Storage
        setValue("imageUrl", `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(file.name)}`)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true)
    try {
      const result = await addCar(data)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Car added successfully!")
        reset()
        setImagePreview(null)
        router.refresh()
      }
    } catch {
      toast.error("Failed to add car. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Car</CardTitle>
        <CardDescription>Add a new vehicle to your rental fleet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Car Name</Label>
              <Input id="name" placeholder="e.g., Model S" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="e.g., Tesla" {...register("brand")} />
              {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerDay">Price per Day ($)</Label>
            <Input id="pricePerDay" type="number" min="1" {...register("pricePerDay", { valueAsNumber: true })} />
            {errors.pricePerDay && <p className="text-sm text-destructive">{errors.pricePerDay.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" placeholder="https://example.com/car-image.jpg" {...register("imageUrl")} />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Or Upload Image</Label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="imageUpload"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-4 transition-colors hover:bg-muted"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload</span>
                <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="h-16 w-24 rounded object-cover"
                />
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Car...
              </>
            ) : (
              "Add Car"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
