
import { Message } from "@/types";
import { MessageCard } from "./MessageCard";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface MessageListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-medical-primary" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500">No messages found</h3>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}
