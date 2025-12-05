"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts"

interface CombinedBookingsChartProps {
  data: Array<Record<string, string | number>>
  brands: string[]
}

// Generate distinct colors for each brand
const brandColors = [
  "#d97706", // amber-600
  "#92400e", // amber-800
  "#fbbf24", // amber-400
  "#78350f", // amber-900
  "#f59e0b", // amber-500
  "#b45309", // amber-700
]

export function CombinedBookingsChart({ data, brands }: CombinedBookingsChartProps) {
  if (data.every((d) => d.totalBookings === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookings Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">No booking data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings by Month & Brand</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              {/* Light yellow gradient for the total bookings area */}
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fef3c7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fef3c7" stopOpacity={0.1} />
              </linearGradient>
              {/* Gradients for each brand */}
              {brands.map((brand, index) => (
                <linearGradient key={brand} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={brandColors[index % brandColors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={brandColors[index % brandColors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0px",
              }}
            />
            <Legend />
            {/* Total bookings line with yellow gradient fill */}
            <Area
              type="monotone"
              dataKey="totalBookings"
              name="Total Bookings"
              stroke="#eab308"
              strokeWidth={3}
              fill="url(#totalGradient)"
            />
            {/* Lines for each brand */}
            {brands.map((brand, index) => (
              <Line
                key={brand}
                type="monotone"
                dataKey={brand}
                name={brand}
                stroke={brandColors[index % brandColors.length]}
                strokeWidth={2}
                dot={{ fill: brandColors[index % brandColors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
