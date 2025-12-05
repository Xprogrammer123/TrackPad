export interface Car {
  id: string
  name: string
  brand: string
  image_url: string | null
  price_per_day: number
  is_booked: boolean
  created_at: string
}

export interface Booking {
  id: string
  car_id: string
  user_id: string
  start_date: string
  end_date: string
  total_price: number
  customer_name: string
  customer_email: string
  customer_phone: string
  created_at: string
  car?: Car
}
