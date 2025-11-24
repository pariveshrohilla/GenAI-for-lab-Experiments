/*
  # Create experiments and results tables
  
  1. New Tables
    - `experiments`
      - `id` (uuid, primary key)
      - `subject` (text) - Subject area (Physics, Chemistry, Biology, etc.)
      - `title` (text) - Experiment title
      - `description` (text) - Experiment description
      - `hypothesis` (text) - User's hypothesis
      - `created_at` (timestamp)
    
    - `experiment_results`
      - `id` (uuid, primary key)
      - `experiment_id` (uuid, foreign key)
      - `simulation_data` (jsonb) - AI-generated simulation results
      - `conclusion` (text) - AI-generated conclusion
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Public read access for all users (experiments are educational)
    - Allow anyone to create new experiments
*/

CREATE TABLE IF NOT EXISTS experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  hypothesis text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  simulation_data jsonb NOT NULL,
  conclusion text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiments"
  ON experiments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create experiments"
  ON experiments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view results"
  ON experiment_results FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create results"
  ON experiment_results FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_experiments_subject ON experiments(subject);
CREATE INDEX idx_experiments_created_at ON experiments(created_at DESC);
CREATE INDEX idx_results_experiment_id ON experiment_results(experiment_id);
