/*
  # Add categories for resources
  
  1. New Tables
    - `resource_categories` (enum type for categories)
    - Add category column to existing tables
  
  2. Changes
    - Add category field to pdf_resources
  
  3. Security
    - Maintain existing RLS policies
*/

-- Create enum type for resource categories
CREATE TYPE resource_category AS ENUM ('code', 'definition', 'formula');

-- Add category to pdf_resources
ALTER TABLE pdf_resources ADD COLUMN category resource_category NOT NULL DEFAULT 'code';