import { AddCarForm } from "@/components/admin/add-car-form"

export const metadata = {
  title: "Add New Car - Admin - TrackPad",
  description: "Add a new car to your rental fleet",
}

export default function AddCarPage() {
  return (
    <div className="mt-8">
      <AddCarForm />
    </div>
  )
}

