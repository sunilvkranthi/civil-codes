/*
  # Add favorites functionality
  
  1. New Tables
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `pdf_id` (uuid, references pdf_resources)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `user_favorites` table
    - Add policies for user-specific CRUD operations
*/

CREATE TABLE user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  pdf_id uuid REFERENCES pdf_resources NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, pdf_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own favorites
CREATE POLICY "Users can read their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to add their own favorites
CREATE POLICY "Users can add their own favorites"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to remove their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);