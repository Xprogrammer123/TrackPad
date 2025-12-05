-- Drop existing admin policies that use subqueries on auth.users
DROP POLICY IF EXISTS "Allow admins to view all bookings" ON bookings;
DROP POLICY IF EXISTS "Allow admins to insert cars" ON cars;
DROP POLICY IF EXISTS "Allow admins to delete cars" ON cars;

-- Recreate admin policies using auth.jwt() instead of subquery on auth.users
-- This avoids the "permission denied for table users" error

-- Admin policy for viewing all bookings
CREATE POLICY "Allow admins to view all bookings" ON bookings
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Admin policy for inserting cars
CREATE POLICY "Allow admins to insert cars" ON cars
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Admin policy for deleting cars
CREATE POLICY "Allow admins to delete cars" ON cars
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );
