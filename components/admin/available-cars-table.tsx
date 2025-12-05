"use client"

import type { Car } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AvailableCarsTableProps {
  cars: Car[]
}

export function AvailableCarsTable({ cars }: AvailableCarsTableProps) {
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
