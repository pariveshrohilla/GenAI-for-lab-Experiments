export interface Experiment {
  id: string;
  subject: string;
  title: string;
  description: string;
  hypothesis: string;
  created_at: string;
}

export interface ExperimentResult {
  id: string;
  experiment_id: string;
  simulation_data: {
    [key: string]: any;
  };
  conclusion: string;
  created_at: string;
}

export const SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Astronomy',
  'Geology',
  'Environmental Science',
  'Materials Science',
  'Engineering',
  'Neuroscience',
  'Microbiology',
];
