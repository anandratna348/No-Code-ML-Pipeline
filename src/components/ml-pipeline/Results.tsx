import { Trophy, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingResult } from '@/types/ml-pipeline';

interface ResultsProps {
  result: TrainingResult;
  onReset: () => void;
}

export function Results({ result, onReset }: ResultsProps) {
  const modelDisplayName = result.modelName === 'logistic_regression' 
    ? 'Logistic Regression' 
    : 'Decision Tree';

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-success';
    if (accuracy >= 0.7) return 'text-primary';
    if (accuracy >= 0.5) return 'text-warning';
    return 'text-destructive';
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 0.9) return 'Excellent';
    if (accuracy >= 0.7) return 'Good';
    if (accuracy >= 0.5) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Step 5: Results</h2>
        <p className="text-muted-foreground">
          Your model has been trained successfully!
        </p>
      </div>

      <Card className="pipeline-card border-success/20 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{modelDisplayName}</h3>
              <p className="text-sm text-muted-foreground">Model Training Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="pipeline-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Accuracy Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${getAccuracyColor(result.accuracy)}`}>
                {(result.accuracy * 100).toFixed(1)}%
              </span>
              <span className={`text-sm font-medium ${getAccuracyColor(result.accuracy)}`}>
                {getAccuracyLabel(result.accuracy)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              The model correctly predicted {(result.accuracy * 100).toFixed(1)}% of test samples
            </p>
          </CardContent>
        </Card>

        <Card className="pipeline-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Dataset Split</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Training samples</span>
              <span className="font-medium text-foreground">{result.trainSize.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Test samples</span>
              <span className="font-medium text-foreground">{result.testSize.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="pipeline-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Confusion Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm text-muted-foreground">Actual \ Predicted</th>
                  {result.classLabels.map((label) => (
                    <th key={label} className="p-2 text-center text-sm font-medium text-foreground">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.confusionMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 text-sm font-medium text-foreground">
                      {result.classLabels[i]}
                    </td>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`p-2 text-center font-mono text-sm ${
                          i === j
                            ? 'bg-success/20 text-success font-semibold'
                            : cell > 0
                            ? 'bg-destructive/10 text-destructive'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            <span className="text-success">Green diagonal</span> = Correct predictions | 
            <span className="text-destructive"> Red cells</span> = Misclassifications
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Start New Pipeline
        </Button>
      </div>
    </div>
  );
}
