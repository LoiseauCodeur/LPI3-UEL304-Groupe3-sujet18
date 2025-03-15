import { useState, useEffect } from "react";

export type Conversation = {
  _id: string;
  title: string;
  text: string;
  finalResponse: string;
  score?: number | null;
  createdAt: Date;
  scenario: string;
};

export type ConversationInput = {
  title: string;
  text: string;
  finalResponse: string;
  score?: number | null;
  scenario: string;
};

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      if (data.success) {
        setConversations(
          data.data.map((conv: any) => ({
            ...conv,
            finalResponse: typeof conv.finalResponse === "string" ? JSON.parse(conv.finalResponse) : conv.finalResponse,
          }))
        );
      } else {
        setError(data.error || "Failed to fetch conversations");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };
  

  const fetchConversationById = async (id: string): Promise<Conversation | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/conversations?id=${id}`);
      const data = await response.json();
      if (data.success) {
        return {
          ...data.data,
          finalResponse:
            typeof data.data.finalResponse === "string"
              ? JSON.parse(data.data.finalResponse)
              : data.data.finalResponse,
        };
      } else {
        setError(data.error || "Failed to fetch conversation");
        return null;
      }
    } catch (err) {
      setError("Network error");
      return null;
    } finally {
      setLoading(false);
    }
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

  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setConversations((prev) => prev.filter((conv) => conv._id !== id));
      } else {
        throw new Error(data.error || "Failed to delete conversation");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, error, fetchConversations, addConversation, fetchConversationById, deleteConversation };
}
