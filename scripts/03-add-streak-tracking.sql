-- Add streak tracking columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON public.profiles(last_activity_date);
