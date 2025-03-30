
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  hasKey: boolean;
  showKey: boolean;
  onApiKeyChange: (key: string) => void;
  onToggleShowKey: () => void;
}

export function ApiKeyInput({
  apiKey,
  hasKey,
  showKey,
  onApiKeyChange,
  onToggleShowKey,
}: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      {hasKey && (
        <div className="flex items-center text-sm text-green-600 mb-2">
          <CheckCircle className="h-4 w-4 mr-1" />
          API key is set and ready to use
        </div>
      )}

      <Label htmlFor="api-key">OpenAI API Key</Label>
      <div className="flex gap-2">
        <Input
          id="api-key"
          type={showKey ? "text" : "password"}
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <Button variant="outline" onClick={onToggleShowKey}>
          {showKey ? "Hide" : "Show"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Your API key is stored only in your browser's local storage and is never sent to our servers.
      </p>
    </div>
  );
}
