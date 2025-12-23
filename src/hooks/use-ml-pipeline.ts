import { useState, useCallback } from 'react';
import { 
  PipelineState, 
  DatasetInfo, 
  PreprocessingConfig, 
  SplitRatio, 
  ModelType, 
  TrainingResult 
} from '@/types/ml-pipeline';

// Configure your Python backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const initialState: PipelineState = {
  currentStep: 1,
  dataset: null,
  preprocessing: {
    standardization: false,
    normalization: false,
  },
  splitRatio: '80-20',
  model: null,
  result: null,
  isLoading: false,
  error: null,
};

export function useMLPipeline() {
  const [state, setState] = useState<PipelineState>(initialState);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: null }));
  }, []);

  const uploadDataset = useCallback(async (file: File) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload dataset');
      }

      const data: DatasetInfo = await response.json();
      setState({
  ...initialState,
  dataset: data,
  currentStep: 2,
  isLoading: false,
  error: null,
  });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload dataset';
      setError(message);
      throw error;
    }
  }, [setLoading, setError]);

  const setPreprocessing = useCallback((config: PreprocessingConfig) => {
    setState(prev => ({
      ...prev,
      preprocessing: config,
    }));
  }, []);

  const applyPreprocessing = useCallback(async () => {
    if (!state.dataset) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/preprocess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standardization: state.preprocessing.standardization,
          normalization: state.preprocessing.normalization,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to apply preprocessing');
      }

      setState(prev => ({
        ...prev,
        currentStep: 3,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to apply preprocessing';
      setError(message);
      throw error;
    }
  }, [state.dataset, state.preprocessing, setLoading, setError]);

  const setSplitRatio = useCallback((ratio: SplitRatio) => {
    setState(prev => ({
      ...prev,
      splitRatio: ratio,
    }));
  }, []);

  const applySplit = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratio: state.splitRatio,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to split data');
      }

      setState(prev => ({
        ...prev,
        currentStep: 4,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to split data';
      setError(message);
      throw error;
    }
  }, [state.splitRatio, setLoading, setError]);

  const setModel = useCallback((model: ModelType) => {
    setState(prev => ({
      ...prev,
      model,
    }));
  }, []);

  const trainModel = useCallback(async () => {
    if (!state.model) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: state.model,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to train model');
      }

      const result: TrainingResult = await response.json();
      setState(prev => ({
        ...prev,
        result,
        currentStep: 5,
        isLoading: false,
        error: null,
      }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to train model';
      setError(message);
      throw error;
    }
  }, [state.model, setLoading, setError]);

  const goToStep = useCallback((step: number) => {
    if (step < 1 || step > 5) return;
    
    // Only allow going to steps that have been completed or are next
    const maxAllowedStep = state.result ? 5 : 
                          state.model ? 4 : 
                          state.splitRatio ? 3 : 
                          state.dataset ? 2 : 1;
    
    if (step <= maxAllowedStep) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, [state]);

  const reset = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
    } catch (e) {
      // Ignore reset errors
    }
    setState(initialState);
  }, []);

  return {
    state,
    uploadDataset,
    setPreprocessing,
    applyPreprocessing,
    setSplitRatio,
    applySplit,
    setModel,
    trainModel,
    goToStep,
    reset,
  };
}
