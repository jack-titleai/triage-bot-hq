
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLLMApiKey, saveLLMApiKey, clearLLMApiKey, hasLLMApiKey } from "@/services/llmService";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { SettingsHeader } from "@/components/SettingsHeader";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface LLMSettingsProps {
  onClose: () => void;
}

export function LLMSettings({ onClose }: LLMSettingsProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  // Check for API key on component mount and whenever visible
  useEffect(() => {
    const storedKey = getLLMApiKey();
    const keyValid = hasLLMApiKey();
    setHasKey(keyValid);
    if (storedKey) {
      setApiKey(showKey ? storedKey : "••••••••••••••••••••••••••");
    } else {
      setApiKey("");
    }
  }, [showKey]);

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
      description: "Your API key has been saved successfully. Reload any uploaded data to use it.",
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
        <Alert variant={hasKey ? "default" : "warning"}>
          <AlertDescription className="flex items-center gap-2">
            {hasKey ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Your OpenAI API key is configured. All messages will be classified using AI.</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>
                  This application uses OpenAI's API to classify healthcare messages.
                  Set up your API key to enable AI-based classification.
                </span>
              </>
            )}
          </AlertDescription>
        </Alert>

        <ApiKeyInput
          apiKey={apiKey}
          hasKey={hasKey}
          showKey={showKey}
          onApiKeyChange={setApiKey}
          onToggleShowKey={handleShowKey}
        />
        
        {hasKey && (
          <p className="text-sm text-green-600">
            Your API key is valid. All messages will be classified using the OpenAI API.
          </p>
        )}
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
