-- Promote a user to admin by setting is_admin in their raw_user_meta_data
-- Replace 'your-email@example.com' with the email of the user you want to make admin

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'fawassaka862@gmail.com';

-- Verify the update
SELECT email, raw_user_meta_data->>'is_admin' as is_admin
FROM auth.users
WHERE email = 'fawassaka862@gmail.com';
