import { useState } from "react";
import { useRecorder } from "@/composables/useRecorder";
import { sendToChatAI } from "@/composables/useChatAI";
import { useTextToSpeech } from "@/composables/useTextToSpeech";
import ChatDisplay from "@/components/ChatDisplay";

interface RecorderProps {
  mode: "single" | "conversation";
  maxExchanges?: number;
  promptKey: string;
}

export default function Recorder({ mode, maxExchanges = 5, promptKey }: RecorderProps) {
  const [chatHistory, setChatHistory] = useState<string>("");
  const [exchangeCount, setExchangeCount] = useState<number>(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [jsonResponse, setJsonResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { playAIResponse } = useTextToSpeech();

  const onTranscription = async (userInput: string) => {
    setIsLoading(true);
    let updatedChatHistory = chatHistory;

    if (mode === "conversation") {
      updatedChatHistory += `\nUser: ${userInput}`;
      setChatHistory(updatedChatHistory);
    }

    const isFinalExchange = mode === "conversation" && exchangeCount === maxExchanges - 1;
    const finalPromptKey = isFinalExchange ? `${promptKey}_feedback` : promptKey;

    const reply = await sendToChatAI(updatedChatHistory || userInput, finalPromptKey);

    if (reply) {
      let parsedReply;
      try {
        parsedReply = JSON.parse(reply);
        if (typeof parsedReply === "object" && parsedReply !== null) {
          setJsonResponse(reply);
          setAiResponse(null);
        }
      } catch {
        setJsonResponse(null);
        setAiResponse(reply);
      }

      if (mode === "conversation" && !isFinalExchange) {
        setChatHistory((prev) => prev + `\nChatGPT: ${reply}`);
        await playAIResponse(reply);
      } 

      if (isFinalExchange) {
        console.log("Final exchange reached! Logging conversation.");
        setChatHistory("");
        logFinalConversation(userInput, updatedChatHistory, reply);
      }

      if (mode === "single") {
        console.log("Single mode: Logging user input and AI response.");
        logFinalConversation(userInput, "", reply);
      }

      setExchangeCount((prev) => prev + 1);
    } else {
      setAiResponse("No response from AI.");
    }

    setIsLoading(false);
  };

  const logFinalConversation = (userInput: string, conversation: string, feedback: string) => {
    console.log("logFinalConversation was called");

    let score: number | null = null;
    try {
      const parsedFeedback = JSON.parse(feedback);
      if ("score" in parsedFeedback) {
        const scoreString = parsedFeedback["score"];
        const match = scoreString.match(/^(\d+)\/10$/);
        if (match) {
          score = parseInt(match[1], 10);
        }
      }
    } catch {
      console.error("Error parsing feedback JSON:", feedback);
    }

    const logData = mode === "single"
      ? { userInput, feedback, score }
      : { conversation, feedback, score };

    console.log("Final Conversation Log:", logData);
  };

  const { isRecording, startRecording, stopRecording } = useRecorder(onTranscription);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-5 py-3 text-white text-lg rounded transition duration-300 ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
      </button>

      {isLoading && <p className="mt-4 text-gray-600 text-sm">⏳ Traitement en cours...</p>}
      {jsonResponse && <ChatDisplay response={jsonResponse} />}
      {aiResponse && !jsonResponse && (
        <p className="mt-4 text-teal-600 text-lg italic max-w-4xl text-center">{aiResponse}</p>
      )}
    </div>
  );
}
