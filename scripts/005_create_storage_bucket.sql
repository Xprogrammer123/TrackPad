-- Create a storage bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to car images
CREATE POLICY "Allow public read access to car images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

-- Allow authenticated users to upload car images
CREATE POLICY "Allow authenticated users to upload car images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'car-images');

-- Allow authenticated users to delete their uploaded images
CREATE POLICY "Allow authenticated users to delete car images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'car-images');
