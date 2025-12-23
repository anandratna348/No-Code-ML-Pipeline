import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PreprocessingConfig } from '@/types/ml-pipeline';
import { cn } from '@/lib/utils';

interface PreprocessingProps {
  config: PreprocessingConfig;
  onChange: (config: PreprocessingConfig) => void;
  onApply: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  numericColumns: string[];
}

export function Preprocessing({ 
  config, 
  onChange, 
  onApply, 
  isLoading, 
  error,
  numericColumns 
}: PreprocessingProps) {
  const handleStandardizationChange = (checked: boolean) => {
    onChange({
      standardization: checked,
      normalization: checked ? false : config.normalization,
    });
  };

  const handleNormalizationChange = (checked: boolean) => {
    onChange({
      normalization: checked,
      standardization: checked ? false : config.standardization,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Step 2: Data Preprocessing</h2>
        <p className="text-muted-foreground">
          Apply preprocessing to your numeric columns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "pipeline-card cursor-pointer transition-all",
            config.standardization && "ring-2 ring-primary shadow-glow"
          )}
          onClick={() => handleStandardizationChange(!config.standardization)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Standardization</CardTitle>
              <Switch
                checked={config.standardization}
                onCheckedChange={handleStandardizationChange}
              />
            </div>
            <CardDescription>StandardScaler</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Transforms features to have zero mean and unit variance. Best for algorithms that 
              assume normally distributed data (e.g., Logistic Regression).
            </p>
            <div className="mt-4 p-3 bg-muted rounded-lg font-mono text-xs">
              z = (x - μ) / σ
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "pipeline-card cursor-pointer transition-all",
            config.normalization && "ring-2 ring-accent shadow-glow"
          )}
          onClick={() => handleNormalizationChange(!config.normalization)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Normalization</CardTitle>
              <Switch
                checked={config.normalization}
                onCheckedChange={handleNormalizationChange}
              />
            </div>
            <CardDescription>MinMaxScaler</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Scales features to a fixed range (0 to 1). Useful when you want to preserve 
              the shape of the original distribution.
            </p>
            <div className="mt-4 p-3 bg-muted rounded-lg font-mono text-xs">
              x' = (x - min) / (max - min)
            </div>
          </CardContent>
        </Card>
      </div>

      {numericColumns.length > 0 && (
        <Card className="pipeline-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Preprocessing will be applied to these columns:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {numericColumns.map((col) => (
                <span
                  key={col}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {col}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={onApply} 
          disabled={isLoading}
          className="bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            'Continue to Split'
          )}
        </Button>
      </div>
    </div>
  );
}
