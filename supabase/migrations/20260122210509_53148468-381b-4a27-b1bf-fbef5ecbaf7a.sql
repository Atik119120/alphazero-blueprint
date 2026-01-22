-- Step 1: Add 'teacher' to app_role enum (separate transaction)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher';