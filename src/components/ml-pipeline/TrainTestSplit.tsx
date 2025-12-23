import { Loader2, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SplitRatio } from '@/types/ml-pipeline';
import { cn } from '@/lib/utils';

interface TrainTestSplitProps {
  ratio: SplitRatio;
  onChange: (ratio: SplitRatio) => void;
  onApply: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  totalRows: number;
}

export function TrainTestSplit({ 
  ratio, 
  onChange, 
  onApply, 
  isLoading, 
  error,
  totalRows 
}: TrainTestSplitProps) {
  const trainPercent = ratio === '80-20' ? 80 : 70;
  const testPercent = 100 - trainPercent;
  const trainRows = Math.round(totalRows * trainPercent / 100);
  const testRows = totalRows - trainRows;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Step 3: Train-Test Split</h2>
        <p className="text-muted-foreground">
          Choose how to split your data for training and testing
        </p>
      </div>

      <Card className="pipeline-card">
        <CardHeader>
          <CardTitle className="text-lg">Split Ratio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={ratio}
            onValueChange={(value) => onChange(value as SplitRatio)}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="ratio-80-20"
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all",
                ratio === '80-20' 
                  ? "border-primary bg-primary/5 shadow-glow" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="80-20" id="ratio-80-20" className="sr-only" />
              <div className="text-3xl font-bold text-gradient">80/20</div>
              <div className="text-sm text-muted-foreground text-center">
                <div>Train: 80%</div>
                <div>Test: 20%</div>
              </div>
            </Label>

            <Label
              htmlFor="ratio-70-30"
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all",
                ratio === '70-30' 
                  ? "border-primary bg-primary/5 shadow-glow" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="70-30" id="ratio-70-30" className="sr-only" />
              <div className="text-3xl font-bold text-gradient">70/30</div>
              <div className="text-sm text-muted-foreground text-center">
                <div>Train: 70%</div>
                <div>Test: 30%</div>
              </div>
            </Label>
          </RadioGroup>

          <div className="p-4 bg-muted rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <PieChart className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Split Preview</span>
            </div>
            
            <div className="h-4 rounded-full overflow-hidden bg-secondary flex">
              <div 
                className="bg-gradient-primary transition-all duration-500"
                style={{ width: `${trainPercent}%` }}
              />
              <div 
                className="bg-gradient-accent transition-all duration-500"
                style={{ width: `${testPercent}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-primary" />
                <span className="text-muted-foreground">Training:</span>
                <span className="font-medium text-foreground">{trainRows.toLocaleString()} rows</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-accent" />
                <span className="text-muted-foreground">Testing:</span>
                <span className="font-medium text-foreground">{testRows.toLocaleString()} rows</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              Splitting...
            </>
          ) : (
            'Continue to Model Selection'
          )}
        </Button>
      </div>
    </div>
  );
}
