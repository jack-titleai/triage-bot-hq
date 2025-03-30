
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsHeaderProps {
  title: string;
  onClose: () => void;
}

export function SettingsHeader({ title, onClose }: SettingsHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          {title}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardTitle>
    </CardHeader>
  );
}
