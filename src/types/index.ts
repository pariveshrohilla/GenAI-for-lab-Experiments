export interface Experiment {
  id: string;
  subject: string;
  title: string;
  description: string;
  hypothesis: string;
  created_at: string;
}

export interface ExperimentImage {
  id: string;
  experiment_id: string;
  image_url: string;
  caption?: string;
  created_at: string;
}

export interface ExperimentResult {
  id: string;
  experiment_id: string;
  simulation_data: {
    [key: string]: any;
  };
  detailed_data?: {
    [key: string]: any;
  };
  conclusion: string;
  theory_explanation?: string;
  methodology_notes?: string;
  created_at: string;
}

export interface ExperimentWithImages extends Experiment {
  images?: ExperimentImage[];
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
