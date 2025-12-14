"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { carSchema, type CarFormData } from "@/lib/validations"
import { editCar } from "@/app/actions/admin"
import { uploadCarImage } from "@/app/actions/upload"
import type { Car } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, X, ImageIcon } from "lucide-react"

interface EditCarFormProps {
  car: Car | null
  isOpen: boolean
  onClose: () => void
}

export function EditCarForm({ car, isOpen, onClose }: EditCarFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  })

  // Reset form when car changes
  useEffect(() => {
    if (car) {
      reset({
        name: car.name,
        brand: car.brand,
        pricePerDay: Number(car.price_per_day),
        imageUrl: car.image_url || "",
      })
      setImagePreview(car.image_url || null)
      setUploadedImageUrl(car.image_url || null)
    } else {
      reset()
      setImagePreview(null)
      setUploadedImageUrl(null)
    }
  }, [car, reset])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadCarImage(formData)

      if (result.error) {
        toast.error(result.error)
        setImagePreview(car?.image_url || null)
        return
      }

      if (result.url) {
        setUploadedImageUrl(result.url)
        setValue("imageUrl", result.url)
        toast.success("Image uploaded successfully!")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
      setImagePreview(car?.image_url || null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setImagePreview(car?.image_url || null)
    setUploadedImageUrl(car?.image_url || null)
    setValue("imageUrl", car?.image_url || "")
  }

  const onSubmit = async (data: CarFormData) => {
    if (!car) return

    setIsSubmitting(true)
    try {
      // Use uploaded image URL if available
      const carData = {
        id: car.id,
        name: data.name,
        brand: data.brand,
        pricePerDay: data.pricePerDay,
        imageUrl: uploadedImageUrl || data.imageUrl,
      }

      const result = await editCar(carData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Car updated successfully!")
        onClose()
        router.refresh()
      }
    } catch {
      toast.error("Failed to update car. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!car) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Car</DialogTitle>
          <DialogDescription>Update the car details below</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Car Name</Label>
              <Input id="edit-name" placeholder="e.g., Model S" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-brand">Brand</Label>
              <Input id="edit-brand" placeholder="e.g., Tesla" {...register("brand")} />
              {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-pricePerDay">Price per Day (₦)</Label>
            <Input
              id="edit-pricePerDay"
              type="number"
              min="1"
              {...register("pricePerDay", { valueAsNumber: true })}
            />
            {errors.pricePerDay && <p className="text-sm text-destructive">{errors.pricePerDay.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Car Image</Label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Car preview"
                  className="h-40 w-60 object-cover border"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                {uploadedImageUrl && uploadedImageUrl !== car.image_url && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1">Uploaded</div>
                )}
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="edit-imageUpload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 transition-colors hover:bg-muted"
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload car image</span>
                <span className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF (max 5MB)</span>
                <input
                  id="edit-imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-imageUrl">Or Enter Image URL</Label>
            <Input
              id="edit-imageUrl"
              placeholder="https://example.com/car-image.jpg"
              {...register("imageUrl")}
              disabled={!!uploadedImageUrl}
            />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Car...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Update Car"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

