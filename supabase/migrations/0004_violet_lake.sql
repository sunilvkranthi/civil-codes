/*
  # Add cascading delete for user favorites

  1. Changes
    - Drop existing foreign key constraint
    - Add new foreign key constraint with CASCADE on delete
    
  2. Security
    - Maintains existing RLS policies
    - Ensures data consistency when deleting resources
*/

ALTER TABLE user_favorites 
  DROP CONSTRAINT user_favorites_pdf_id_fkey,
  ADD CONSTRAINT user_favorites_pdf_id_fkey 
    FOREIGN KEY (pdf_id) 
    REFERENCES pdf_resources(id) 
    ON DELETE CASCADE;