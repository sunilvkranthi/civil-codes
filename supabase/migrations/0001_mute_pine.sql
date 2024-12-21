/*
  # Initial Schema Setup

  1. New Tables
    - `pdf_resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `drive_link` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `pdf_resources` table
    - Add policies for:
      - Anyone can read pdf_resources
      - Only authenticated users can insert new resources
      - Users can only update/delete their own resources
*/

CREATE TABLE pdf_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  drive_link text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE pdf_resources ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read pdf_resources
CREATE POLICY "Anyone can read pdf_resources"
  ON pdf_resources
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own resources
CREATE POLICY "Users can insert their own resources"
  ON pdf_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own resources
CREATE POLICY "Users can update their own resources"
  ON pdf_resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own resources
CREATE POLICY "Users can delete their own resources"
  ON pdf_resources
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);