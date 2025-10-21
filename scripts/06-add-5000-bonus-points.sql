-- Add 5,000 bonus points to sid.koolkarni@gmail.com
UPDATE public.profiles
SET total_points = total_points + 5000,
    updated_at = NOW()
WHERE email = 'sid.koolkarni@gmail.com';

-- Verify the update
SELECT email, username, total_points 
FROM public.profiles 
WHERE email = 'sid.koolkarni@gmail.com';
