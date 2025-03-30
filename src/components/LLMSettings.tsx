
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLLMApiKey, saveLLMApiKey, clearLLMApiKey, hasLLMApiKey } from "@/services/llmService";
import { useToast } from "@/hooks/use-toast";
import { Settings, X, CheckCircle } from "lucide-react";

interface LLMSettingsProps {
  onClose: () => void;
}

export function LLMSettings({ onClose }: LLMSettingsProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = getLLMApiKey();
    setHasKey(!!storedKey);
    if (storedKey) {
      setApiKey("••••••••••••••••••••••••••");
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey || apiKey === "••••••••••••••••••••••••••") {
      toast({
        title: "API key required",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    saveLLMApiKey(apiKey);
    setHasKey(true);
    setShowKey(false);
    toast({
      title: "API key saved",
      description: "Your API key has been saved successfully",
    });
  };

  const handleClearKey = () => {
    clearLLMApiKey();
    setApiKey("");
    setHasKey(false);
    toast({
      title: "API key removed",
      description: "Your API key has been removed",
    });
  };

  const handleShowKey = () => {
    if (showKey) {
      setShowKey(false);
      if (hasKey) {
        setApiKey("••••••••••••••••••••••••••");
      }
    } else {
      setShowKey(true);
      const storedKey = getLLMApiKey();
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            LLM API Settings
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            This application uses OpenAI's API to classify healthcare messages. 
            You need to provide your own API key to enable LLM classification.
          </AlertDescription>
        </Alert>

        {hasKey && (
          <div className="flex items-center text-sm text-green-600 mb-2">
            <CheckCircle className="h-4 w-4 mr-1" />
            API key is set and ready to use
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button variant="outline" onClick={handleShowKey}>
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Your API key is stored only in your browser's local storage and is never sent to our servers.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleClearKey} disabled={!hasKey}>
          Clear Key
        </Button>
        <Button onClick={handleSaveKey}>Save Key</Button>
      </CardFooter>
    </Card>
  );
}
