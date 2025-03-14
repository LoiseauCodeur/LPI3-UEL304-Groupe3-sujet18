import { useState } from "react";
import { useRecorder } from "@/composables/useRecorder";
import { sendToChatAI } from "@/composables/useChatAI";
import { useTextToSpeech } from "@/composables/useTextToSpeech";

interface RecorderProps {
  mode: "single" | "conversation";
  maxExchanges?: number;
  promptKey: string;
}

export default function Recorder({ mode, maxExchanges = 5, promptKey }: RecorderProps) {
  const [chatHistory, setChatHistory] = useState<string>("");
  const [exchangeCount, setExchangeCount] = useState<number>(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
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
    const finalPromptKey = isFinalExchange ? `${promptKey}_final` : promptKey;

    const reply = await sendToChatAI(updatedChatHistory || userInput, finalPromptKey);

    if (reply) {
      setAiResponse(reply);

      if (mode === "conversation" && !isFinalExchange) {
        setChatHistory((prev) => prev + `\nChatGPT: ${reply}`);
        await playAIResponse(reply);
      } else if (isFinalExchange) {
        setChatHistory("");
      }
      setExchangeCount((prev) => prev + 1);
    } else {
      setAiResponse("No response from AI.");
    }

    setIsLoading(false);
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
      {aiResponse && <p className="mt-4 text-teal-600 text-lg italic max-w-4xl text-center">{aiResponse}</p>}
    </div>
  );
}
