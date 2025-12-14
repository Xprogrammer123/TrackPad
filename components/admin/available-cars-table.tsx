"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Car } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditCarForm } from "@/components/admin/edit-car-form"
import { deleteCar } from "@/app/actions/admin"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AvailableCarsTableProps {
  cars: Car[]
}

export function AvailableCarsTable({ cars }: AvailableCarsTableProps) {
  const router = useRouter()
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<Car | null>(null)

  const handleEdit = (car: Car) => {
    setEditingCar(car)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (car: Car) => {
    setCarToDelete(car)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return

    setDeletingCarId(carToDelete.id)
    try {
      const result = await deleteCar(carToDelete.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Car deleted successfully!")
        setIsDeleteDialogOpen(false)
        setCarToDelete(null)
        router.refresh()
      }
    } catch {
      toast.error("Failed to delete car. Please try again.")
    } finally {
      setDeletingCarId(null)
    }
  }

  if (cars.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Cars</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No available cars at the moment</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Available Cars ({cars.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Car</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image_url || "/placeholder.svg?height=40&width=60&query=car"}
                          alt={`${car.brand} ${car.name}`}
                          className="h-10 w-14 object-cover"
                        />
                        <p className="font-medium">{car.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{car.brand}</TableCell>
                    <TableCell>
                      <p className="font-semibold">₦{Number(car.price_per_day).toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(car)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(car)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EditCarForm car={editingCar} isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {carToDelete?.brand} {carToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={!!deletingCarId}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={!!deletingCarId}>
              {deletingCarId ? (
                <>
                  <span className="mr-2">Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
