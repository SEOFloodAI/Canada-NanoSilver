import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerProps {
  variant?: 'header' | 'inline' | 'footer';
  className?: string;
}

export function Disclaimer({ variant = 'inline', className }: DisclaimerProps) {
  const content = {
    header: (
      <div className={cn(
        "w-full bg-amber-950/80 border-y border-amber-500/30 py-3 px-4",
        className
      )}>
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-400">Disclaimer:</span>{' '}
            This portal provides indexed research summaries from PubMed. It is for informational and research purposes only. 
            The data presented does not constitute medical advice, claims of efficacy, or treatment recommendations. 
            Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    ),
    inline: (
      <div className={cn(
        "bg-amber-950/50 border border-amber-500/30 rounded-lg p-4",
        className
      )}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200/90 leading-relaxed">
            <p className="font-semibold text-amber-400 mb-1">Important Notice</p>
            <p>
              This portal provides indexed research summaries from PubMed for informational and research purposes only. 
              The data presented does not constitute medical advice, claims of efficacy, or treatment recommendations. 
              Always consult a qualified healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    ),
    footer: (
      <div className={cn(
        "text-xs text-muted-foreground/70 leading-relaxed",
        className
      )}>
        <span className="font-semibold">Disclaimer:</span>{' '}
        This portal provides indexed research summaries from PubMed for informational purposes only. 
        Not medical advice. Consult a healthcare professional for medical guidance.
      </div>
    ),
  };

  return content[variant];
}

export function WellnessDisclaimer({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-blue-950/50 border border-blue-500/30 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-200/90 leading-relaxed">
          <p className="font-semibold text-blue-400 mb-1">Wellness Journal Notice</p>
          <p>
            This is a personal wellness journal app. It is not a medical device and does not provide treatment advice. 
            You are solely tracking your own observations. This app does not diagnose, treat, cure, or prevent any disease. 
            All data is stored locally on your device. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProductDisclaimer({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-slate-950/50 border border-slate-500/30 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300/90 leading-relaxed">
          <p className="font-semibold text-slate-400 mb-1">Product Notice</p>
          <p>
            Our nano silver products are sold for research purposes and as dietary supplements where permitted by law. 
            These statements have not been evaluated by Health Canada or the FDA. 
            Our products are not intended to diagnose, treat, cure, or prevent any disease. 
            Always consult with a healthcare professional before using any supplement.
          </p>
        </div>
      </div>
    </div>
  );
}
