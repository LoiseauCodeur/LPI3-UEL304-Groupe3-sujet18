import { useState } from "react";
import { useRecorder } from "@/composables/useRecorder";
import { sendToChatAI } from "@/composables/useChatAI";
import { useTextToSpeech } from "@/composables/useTextToSpeech";
import { useConversations, ConversationInput } from "@/composables/useConversations";
import ChatDisplay from "@/components/ChatDisplay";

interface RecorderProps {
  mode: "single" | "conversation";
  maxExchanges?: number;
  promptKey: string;
  refreshHistory: () => void;
}

export default function Recorder({ mode, maxExchanges = 5, promptKey, refreshHistory }: RecorderProps) {
  const [chatHistory, setChatHistory] = useState<string>("");
  const [exchangeCount, setExchangeCount] = useState<number>(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [jsonResponse, setJsonResponse] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinalResponseShown, setIsFinalResponseShown] = useState<boolean>(false);

  const { playAIResponse } = useTextToSpeech();
  const { addConversation } = useConversations();

  const onTranscription = async (userInput: string) => {
    setIsLoading(true);
    let updatedChatHistory = chatHistory;

    if (mode === "conversation") {
      updatedChatHistory += `\nVous: ${userInput}`;
      setChatHistory(updatedChatHistory);
    }

    const isFinalExchange = mode === "conversation" && exchangeCount === maxExchanges - 1;
    const finalPromptKey = isFinalExchange ? `${promptKey}_feedback` : promptKey;

    const reply = await sendToChatAI(updatedChatHistory || userInput, finalPromptKey);

    if (reply) {
      try {
        const parsedReply = JSON.parse(reply);
        if (typeof parsedReply === "object" && parsedReply !== null) {
          setJsonResponse(parsedReply);
          setAiResponse(null);
          setIsFinalResponseShown(true);

          const title: string = parsedReply.titre || "Conversation sans titre";
          const finalResponse: string = reply;

          let score: number | null = null;
          if (typeof parsedReply.score === "string") {
            const extractedScore = parseInt(parsedReply.score.split("/")[0], 10);
            if (!isNaN(extractedScore)) {
              score = extractedScore;
            }
          }

          let text = mode === "single" ? userInput : updatedChatHistory;
          if (isFinalExchange) {
            text = chatHistory;
            setChatHistory("");
          }

          const newConversation: ConversationInput = {
            title,
            text,
            finalResponse,
            score,
            scenario: promptKey,
          };

          await addConversation(newConversation);
        }
      } catch {
        setJsonResponse(null);
        setAiResponse(reply);
      }

      if (mode === "conversation" && !isFinalExchange) {
        setChatHistory((prev) => prev + `\nIA: ${reply}`);
        await playAIResponse(reply);
      }

      setExchangeCount((prev) => prev + 1);
    } else {
      setAiResponse("No response from AI.");
    }

    setIsLoading(false);
  };

  const handleNewExchange = async () => {
    setJsonResponse(null);
    setAiResponse(null);
    setIsFinalResponseShown(false);
    setChatHistory("");
    setExchangeCount(0);
  
    await refreshHistory();
  };

  const { isRecording, startRecording, stopRecording } = useRecorder(onTranscription);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl bg-[#f8ffff] shadow-md rounded-lg">
      {isFinalResponseShown ? (
        <button
          onClick={handleNewExchange}
          className="px-5 py-3 text-white text-lg rounded-lg transition duration-300 bg-green-600 hover:bg-green-700 shadow-md"
        >
          🔄 Nouvel échange
        </button>
      ) : (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-5 py-3 text-white text-lg font-semibold rounded-lg transition duration-300 shadow-md ${
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#004aad] hover:bg-[#003488]"
          }`}
        >
          {isRecording ? "⏹ Arrêter l'enregistrement" : "🎤 Commencer l'enregistrement"}
        </button>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center space-x-2 text-[#004aad]">
          <span className="animate-spin h-5 w-5 border-4 border-[#004aad] border-t-transparent rounded-full"></span>
          <p className="text-lg">Traitement en cours...</p>
        </div>
      )}

      {jsonResponse && <ChatDisplay response={jsonResponse} />}
      {aiResponse && !jsonResponse && (
        <p className="mt-4 text-[#004aad] text-lg italic max-w-4xl text-center bg-[#a8d2e9] p-4 rounded-lg shadow-md">
          {aiResponse}
        </p>
      )}
    </div>
  );
}

