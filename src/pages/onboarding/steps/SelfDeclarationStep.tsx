import { Download, FileText, Upload, X, CheckCircle2 } from 'lucide-react';
import { message } from 'antd';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function SelfDeclarationStep() {
  const { formData, updateSelfDeclaration, supplierData } = useOnboardingStore();
  const { selfDeclaration } = formData;
  const existingSelfDeclarationUrl = supplierData?.custom_self_declaration;

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Self-Declaration-Certificate-Clean-Copy.pdf';
    link.download = 'Self-Declaration-Certificate-Clean-Copy.pdf';
    link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Self Declaration</h1>
        <p className="text-muted-foreground">
          Download the Self Declaration Certificate template, fill it out, sign it,
          and upload the completed document.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Download Template */}
            <div className="flex flex-col gap-3">
              <Label>Download Template</Label>
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Self-Declaration-Certificate-Clean-Copy.pdf
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Download, fill, sign, and upload below
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload Signed Document */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="self_declaration_document">
                Upload Signed Self Declaration <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-3">
                {/* Show existing attachment from ERPNext */}
                {existingSelfDeclarationUrl && !selfDeclaration.self_declaration_document && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-400">Previously uploaded</span>
                      <a
                        href={`${import.meta.env.VITE_ERPNEXT_API_URL}${existingSelfDeclarationUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline hover:text-blue-800"
                      >
                        View file
                      </a>
                    </div>
                  </div>
                )}
                {selfDeclaration.self_declaration_document ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{selfDeclaration.self_declaration_document.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(selfDeclaration.self_declaration_document.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateSelfDeclaration({ self_declaration_document: null })}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="self_declaration_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateSelfDeclaration({ self_declaration_document: file });
                        }
                      }}
                      className="h-14 cursor-pointer"
                    />
                    <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {existingSelfDeclarationUrl
                    ? 'Upload a new file to replace the existing one, or leave as is'
                    : 'Upload PDF, JPG, or PNG file (Max 5MB)'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function validateSelfDeclaration(
  data: { self_declaration_document?: File | null },
  existingUrl?: string
): boolean {
  message.destroy();

  if (!data.self_declaration_document && !existingUrl) {
    message.error({ content: 'Please upload signed Self Declaration document', key: 'validation-error' });
    return false;
  }
  if (data.self_declaration_document && data.self_declaration_document.size > 5 * 1024 * 1024) {
    message.error({ content: 'Self Declaration document size should be less than 5MB', key: 'validation-error' });
    return false;
  }
  return true;
}
