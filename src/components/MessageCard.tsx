
import { useState } from "react";
import { Message } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./CategoryBadge";
import { TriageBadge } from "./TriageBadge";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const formattedDate = format(new Date(message.datetime), "MMM d, yyyy h:mm a");
  
  return (
    <Card className={cn(
      "mb-4 transition-all duration-200 hover:shadow-md",
      message.triage_level === "Urgent" && "border-l-4 border-l-triage-urgent",
      message.triage_level === "High" && "border-l-4 border-l-triage-high",
      message.triage_level === "Medium" && "border-l-4 border-l-triage-medium",
      message.triage_level === "Low" && "border-l-4 border-l-triage-low",
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1">{message.subject}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
            </div>
          </div>
          <div className="flex space-x-2">
            <CategoryBadge category={message.triage_category} />
            <TriageBadge level={message.triage_level} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <p className={cn(
          "text-sm text-gray-600 transition-all duration-200",
          expanded ? "" : "line-clamp-2"
        )}>
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end pt-1 pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
