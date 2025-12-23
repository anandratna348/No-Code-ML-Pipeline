import { Brain } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { DatasetUpload } from './DatasetUpload';
import { Preprocessing } from './Preprocessing';
import { TrainTestSplit } from './TrainTestSplit';
import { ModelSelection } from './ModelSelection';
import { Results } from './Results';
import { useMLPipeline } from '@/hooks/use-ml-pipeline';

export function MLPipeline() {
  const {
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
  } = useMLPipeline();

  const getCompletedSteps = () => {
    const completed: number[] = [];
    if (state.dataset) completed.push(1);
    if (state.currentStep > 2) completed.push(2);
    if (state.currentStep > 3) completed.push(3);
    if (state.currentStep > 4) completed.push(4);
    if (state.result) completed.push(5);
    return completed;
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <DatasetUpload
            onUpload={uploadDataset}
            dataset={state.dataset}
            isLoading={state.isLoading}
            error={state.error}
          />
        );
      case 2:
        return (
          <Preprocessing
            config={state.preprocessing}
            onChange={setPreprocessing}
            onApply={applyPreprocessing}
            isLoading={state.isLoading}
            error={state.error}
            numericColumns={state.dataset?.numericColumns || []}
          />
        );
      case 3:
        return (
          <TrainTestSplit
            ratio={state.splitRatio}
            onChange={setSplitRatio}
            onApply={applySplit}
            isLoading={state.isLoading}
            error={state.error}
            totalRows={state.dataset?.rows || 0}
          />
        );
      case 4:
        return (
          <ModelSelection
            model={state.model}
            onChange={setModel}
            onTrain={trainModel}
            isLoading={state.isLoading}
            error={state.error}
          />
        );
      case 5:
        return state.result ? (
          <Results result={state.result} onReset={reset} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <header className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            No-Code ML Pipeline
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">ML Pipeline</span>
            <span className="text-foreground"> Builder</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Build and train machine learning models without writing a single line of code
          </p>
        </header>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          completedSteps={getCompletedSteps()}
          onStepClick={goToStep}
        />

        {/* Current Step Content */}
        <main className="mt-8">
          {renderStep()}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
        <span>Developed by Anand Ratna </span>
        </footer>

      </div>
    </div>
  );
}
