-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  image_url TEXT,
  price_per_day NUMERIC NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cars table (publicly readable, admin can insert/update/delete)
CREATE POLICY "Allow public read access to cars" ON cars
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update car booking status" ON cars
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for bookings table
CREATE POLICY "Allow users to view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policies for viewing all bookings (using user metadata)
CREATE POLICY "Allow admins to view all bookings" ON bookings
  FOR SELECT USING (
    (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
  );

CREATE POLICY "Allow admins to insert cars" ON cars
  FOR INSERT WITH CHECK (
    (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
  );

CREATE POLICY "Allow admins to delete cars" ON cars
  FOR DELETE USING (
    (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
  );
