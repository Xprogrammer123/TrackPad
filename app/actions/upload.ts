"use server"

import { createClient } from "@/lib/supabase/server"

export async function uploadCarImage(formData: FormData) {
  const supabase = await createClient()

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to upload images" }
  }

  const file = formData.get("file") as File
  if (!file) {
    return { error: "No file provided" }
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." }
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { error: "File too large. Maximum size is 5MB." }
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `cars/${fileName}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage.from("car-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return { error: "Failed to upload image. Please try again." }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("car-images").getPublicUrl(filePath)

  return { url: publicUrl }
}
