import { useState, useEffect } from "react";
import { IConversation } from "../models/Conversation";

export type ConversationInput = {
  title: string;
  text: string;
  finalResponse: string;
  score?: number | null;
  scenario: string;
};

export function useConversations() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      } else {
        setError(data.error || "Failed to fetch conversations");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const addConversation = async (conversation: ConversationInput) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversation),
      });

      const data = await response.json();
      if (data.success) {
        setConversations((prev) => [data.data, ...prev]);
      } else {
        throw new Error(data.error || "Failed to add conversation");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, error, fetchConversations, addConversation };
}
