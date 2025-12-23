import { Loader2, TrendingUp, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ModelType } from '@/types/ml-pipeline';
import { cn } from '@/lib/utils';

interface ModelSelectionProps {
  model: ModelType | null;
  onChange: (model: ModelType) => void;
  onTrain: () => Promise<unknown>;
  isLoading: boolean;
  error: string | null;
}

const models = [
  {
    id: 'logistic_regression' as ModelType,
    name: 'Logistic Regression',
    description: 'A linear model for binary and multiclass classification. Works well with linearly separable data.',
    icon: TrendingUp,
    pros: ['Fast training', 'Interpretable', 'Works with small datasets'],
    cons: ['Assumes linear relationships', 'May underfit complex data'],
  },
  {
    id: 'decision_tree' as ModelType,
    name: 'Decision Tree',
    description: 'A tree-based model that makes decisions through a series of questions about feature values.',
    icon: GitBranch,
    pros: ['Handles non-linear data', 'Easy to visualize', 'No scaling needed'],
    cons: ['Can overfit easily', 'Sensitive to data changes'],
  },
];

export function ModelSelection({ model, onChange, onTrain, isLoading, error }: ModelSelectionProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Step 4: Model Selection</h2>
        <p className="text-muted-foreground">
          Choose a machine learning model to train on your data
        </p>
      </div>

      <RadioGroup
        value={model || ''}
        onValueChange={(value) => onChange(value as ModelType)}
        className="grid gap-4 md:grid-cols-2"
      >
        {models.map((m) => (
          <Label
            key={m.id}
            htmlFor={m.id}
            className="cursor-pointer"
          >
            <Card
              className={cn(
                "pipeline-card h-full transition-all",
                model === m.id && "ring-2 ring-primary shadow-glow"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <m.icon className="w-6 h-6 text-primary" />
                  </div>
                  <RadioGroupItem value={m.id} id={m.id} />
                </div>
                <CardTitle className="text-lg mt-3">{m.name}</CardTitle>
                <CardDescription>{m.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-success">Pros:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {m.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-success">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-warning">Cons:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {m.cons.map((con, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-warning">•</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={onTrain} 
          disabled={!model || isLoading}
          className="bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Training Model...
            </>
          ) : (
            'Train Model'
          )}
        </Button>
      </div>
    </div>
  );
}
