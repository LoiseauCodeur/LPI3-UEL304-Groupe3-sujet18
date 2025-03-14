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
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-lg">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-5 py-3 text-[#c0bb39] font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#c0bb39]/50 ${
          isRecording ? "bg-[#6d1717] hover:bg-[#580f0f]" : "bg-[#6d1717] hover:bg-[#580f0f]"
        }`}
      >
        {isRecording ? "⏹️ Arrêter l'enregistrement" : "🎤 Commencer l'enregistrement"}
      </button>

      {isLoading && <p className="mt-4 text-[#c0bb39] text-sm">⏳ Traitement en cours...</p>}

      {aiResponse && (
        <div className="mt-4 bg-[#1a1a1a] border border-[#c0bb39]/30 text-[#c0bb39] text-lg italic p-4 rounded-lg shadow-lg max-w-full text-center">
          {aiResponse}
        </div>
      )}
    </div>
  );
}
