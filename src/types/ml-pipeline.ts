export interface DatasetInfo {
  filename: string;
  rows: number;
  columns: number;
  columnNames: string[];
  numericColumns: string[];
  preview: Record<string, unknown>[];
}

export interface PreprocessingConfig {
  standardization: boolean;
  normalization: boolean;
}

export type SplitRatio = '70-30' | '80-20';

export type ModelType = 'logistic_regression' | 'decision_tree';

export interface TrainingResult {
  accuracy: number;
  confusionMatrix: number[][];
  classLabels: string[];
  modelName: string;
  trainSize: number;
  testSize: number;
}

export interface PipelineState {
  currentStep: number;
  dataset: DatasetInfo | null;
  preprocessing: PreprocessingConfig;
  splitRatio: SplitRatio;
  model: ModelType | null;
  result: TrainingResult | null;
  isLoading: boolean;
  error: string | null;
}

export type PipelineStep = 1 | 2 | 3 | 4 | 5;
