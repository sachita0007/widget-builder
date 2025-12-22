import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type Widget } from "@shared/schema";

interface CustomizationPanelProps {
  widget: Widget;
  onChange: (updates: Partial<Widget>) => void;
}

export function CustomizationPanel({ widget, onChange }: CustomizationPanelProps) {
  return (
    <div className="space-y-8 p-1">
      {/* Template Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Template Style</Label>
        <RadioGroup 
          value={widget.templateType} 
          onValueChange={(val) => onChange({ templateType: val as any })}
          className="grid grid-cols-1 gap-4"
        >
          {[
            { id: "aggregated", name: "Aggregated Summary", desc: "Best for overall rating impact" },
            { id: "google", name: "Google Style", desc: "Horizontal scrolling cards" },
            { id: "image", name: "Visual Grid", desc: "Focus on user-generated content" },
            { id: "ai", name: "AI Generated", desc: "Generate reviews from personas" }
          ].map((type) => (
            <div key={type.id}>
              <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
              <Label
                htmlFor={type.id}
                className="flex flex-col p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-blue-100 hover:bg-blue-50/50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all"
              >
                <span className="font-bold text-slate-900">{type.name}</span>
                <span className="text-xs text-slate-500 mt-1">{type.desc}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Branding</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={widget.primaryColor || "#000000"} 
                onChange={(e) => onChange({ primaryColor: e.target.value })} 
                className="w-10 h-10 p-1 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500">{widget.primaryColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Secondary Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={widget.secondaryColor || "#ffffff"} 
                onChange={(e) => onChange({ secondaryColor: e.target.value })} 
                className="w-10 h-10 p-1 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500">{widget.secondaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Options */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Layout & Typography</Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Font Style</Label>
            <Select value={widget.fontStyle || "sans"} onValueChange={(val) => onChange({ fontStyle: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans">Modern Sans</SelectItem>
                <SelectItem value="serif">Classic Serif</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Corner Radius</Label>
            <Select value={widget.cornerRadius || "rounded"} onValueChange={(val) => onChange({ cornerRadius: val as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="sharp">Sharp / Boxy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Badge Options */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Verified Badge</Label>
            <p className="text-xs text-slate-500">Show "Verified by Freestand" seal</p>
          </div>
          <Switch 
            checked={widget.showBadge || false} 
            onCheckedChange={(val) => onChange({ showBadge: val })} 
          />
        </div>

        {widget.showBadge && (
          <div className="space-y-2">
             <Label className="text-xs">Badge Position</Label>
             <Select value={widget.badgePosition || "footer"} onValueChange={(val) => onChange({ badgePosition: val as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="footer">Bottom of Widget</SelectItem>
                <SelectItem value="top-right">Top Right Corner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
