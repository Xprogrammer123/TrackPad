"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { carSchema, type CarFormData } from "@/lib/validations"
import { addCar } from "@/app/actions/admin"
import { uploadCarImage } from "@/app/actions/upload"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, X, ImageIcon } from "lucide-react"

export function AddCarForm() {
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
    defaultValues: {
      name: "",
      brand: "",
      pricePerDay: 50,
      imageUrl: "",
    },
  })

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
        setImagePreview(null)
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
      setImagePreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    setUploadedImageUrl(null)
    setValue("imageUrl", "")
  }

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true)
    try {
      // Use uploaded image URL if available
      const carData = {
        ...data,
        imageUrl: uploadedImageUrl || data.imageUrl,
      }

      const result = await addCar(carData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Car added successfully!")
        reset()
        setImagePreview(null)
        setUploadedImageUrl(null)
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
            <Label htmlFor="pricePerDay">Price per Day (₦)</Label>
            <Input id="pricePerDay" type="number" min="1" {...register("pricePerDay", { valueAsNumber: true })} />
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
                {uploadedImageUrl && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1">Uploaded</div>
                )}
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="imageUpload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 transition-colors hover:bg-muted"
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload car image</span>
                <span className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF (max 5MB)</span>
                <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Or Enter Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/car-image.jpg"
              {...register("imageUrl")}
              disabled={!!uploadedImageUrl}
            />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Car...
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Image...
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
