import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function WidgetEmbedCode({ widgetId }: { widgetId: number }) {
  const [copied, setCopied] = useState(false);
  
  const code = `<div id="freestand-widget-${widgetId}"></div>
<script src="https://cdn.freestand.com/widget.js" data-id="${widgetId}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Code2 className="w-4 h-4" /> Embed Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed on your website</DialogTitle>
          <DialogDescription>
            Copy and paste this snippet where you want the reviews to appear.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-900 rounded-lg p-4 mt-2 relative group">
          <code className="text-sm font-mono text-green-400 break-all">
            {code}
          </code>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 text-white hover:text-white hover:bg-white/20"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
