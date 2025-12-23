import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DatasetInfo } from '@/types/ml-pipeline';

interface DatasetUploadProps {
  onUpload: (file: File) => Promise<DatasetInfo>;
  dataset: DatasetInfo | null;
  isLoading: boolean;
  error: string | null;
}

export function DatasetUpload({ onUpload, dataset, isLoading, error }: DatasetUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      await onUpload(file);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
  }, [onUpload]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Step 1: Upload Dataset</h2>
        <p className="text-muted-foreground">
          Upload your CSV or Excel file to begin the ML pipeline
        </p>
      </div>

      <Card className="pipeline-card">
        <CardContent className="pt-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              isLoading && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {isLoading ? 'Uploading...' : 'Drop your file here or click to browse'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV and Excel (.xlsx) files
                  </p>
                </div>
                <Button variant="outline" disabled={isLoading}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Select File
                </Button>
              </div>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {dataset && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg animate-slide-up">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Dataset loaded successfully!</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Filename</p>
                      <p className="font-medium text-foreground truncate">{dataset.filename}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Rows</p>
                      <p className="font-medium text-foreground">{dataset.rows.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Columns</p>
                      <p className="font-medium text-foreground">{dataset.columns}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Column Names:</p>
                    <div className="flex flex-wrap gap-2">
                      {dataset.columnNames.map((col) => (
                        <span
                          key={col}
                          className={cn(
                            "px-2 py-1 rounded-md text-xs font-medium",
                            dataset.numericColumns.includes(col)
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="text-primary">Highlighted</span> columns are numeric and will be used for preprocessing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
