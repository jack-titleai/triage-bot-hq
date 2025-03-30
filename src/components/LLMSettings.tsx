
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLLMApiKey, saveLLMApiKey, clearLLMApiKey } from "@/services/llmService";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { SettingsHeader } from "@/components/SettingsHeader";

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
      <SettingsHeader title="LLM API Settings" onClose={onClose} />
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            This application uses OpenAI's API to classify healthcare messages. 
            You need to provide your own API key to enable LLM classification.
          </AlertDescription>
        </Alert>

        <ApiKeyInput
          apiKey={apiKey}
          hasKey={hasKey}
          showKey={showKey}
          onApiKeyChange={setApiKey}
          onToggleShowKey={handleShowKey}
        />
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
