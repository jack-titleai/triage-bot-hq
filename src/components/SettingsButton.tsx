
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LLMSettings } from "@/components/LLMSettings";

export function SettingsButton() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LLMSettings onClose={() => setShowSettings(false)} />
      </DialogContent>
    </Dialog>
  );
}
