/*
  # Add images and detailed experiment data
  
  1. New Tables
    - `experiment_images`
      - `id` (uuid, primary key)
      - `experiment_id` (uuid, foreign key)
      - `image_url` (text) - URL to the experiment image
      - `caption` (text) - Image description
      - `created_at` (timestamp)
  
  2. Updated Tables
    - `experiment_results`
      - `detailed_data` (jsonb) - More comprehensive scientific data
      - `theory_explanation` (text) - Scientific theory behind results
      - `methodology_notes` (text) - Detailed methodology information
  
  3. Security
    - Enable RLS on experiment_images table
    - Public read access
*/

CREATE TABLE IF NOT EXISTS experiment_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiment_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiment images"
  ON experiment_images FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add experiment images"
  ON experiment_images FOR INSERT
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiment_results' AND column_name = 'detailed_data'
  ) THEN
    ALTER TABLE experiment_results ADD COLUMN detailed_data jsonb;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiment_results' AND column_name = 'theory_explanation'
  ) THEN
    ALTER TABLE experiment_results ADD COLUMN theory_explanation text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiment_results' AND column_name = 'methodology_notes'
  ) THEN
    ALTER TABLE experiment_results ADD COLUMN methodology_notes text;
  END IF;
END $$;

CREATE INDEX idx_images_experiment_id ON experiment_images(experiment_id);
