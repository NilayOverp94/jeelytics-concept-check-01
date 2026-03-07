import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  // Use Google Docs viewer to prevent download
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(window.location.origin + url)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h3 className="text-sm font-semibold truncate flex-1 mr-4">{title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 flex-shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative select-none" onContextMenu={(e) => e.preventDefault()}>
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          title={title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
