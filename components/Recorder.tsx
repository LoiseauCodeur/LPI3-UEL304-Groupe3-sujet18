import { useState } from "react";
import { useRecorder } from "@/composables/useRecorder";
import { sendToChatAI } from "@/composables/useChatAI";
import { useTextToSpeech } from "@/composables/useTextToSpeech";

interface RecorderProps {
  title: string;
  mode: "single" | "conversation";
  maxExchanges?: number; 
  promptKey: string;
}

export default function Recorder({ title, mode, maxExchanges = 5, promptKey }: RecorderProps) {
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

    // Use a different promptKey for the last exchange
    const isFinalExchange = mode === "conversation" && exchangeCount === maxExchanges - 1;
    const finalPromptKey = isFinalExchange ? `${promptKey}_final` : promptKey;

    const reply = await sendToChatAI(updatedChatHistory || userInput, finalPromptKey);
    
    if (reply) {
      setAiResponse(reply);

      if (mode === "conversation" && !isFinalExchange) {
        setChatHistory((prev) => prev + `\nChatGPT: ${reply}`);
        await playAIResponse(reply);
      } else if (isFinalExchange) {
        setChatHistory(""); // Reset history for new conversations
      }
      setExchangeCount((prev) => prev + 1);
    } else {
      setAiResponse("⚠️ No response from AI.");
    }

    setIsLoading(false);
  };

  const { isRecording, startRecording, stopRecording } = useRecorder(onTranscription);

  return (
    <div>
      <h1 style={styles.title}>{title}</h1>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          ...styles.button,
          backgroundColor: isRecording ? "#d9534f" : "#0275d8",
        }}
      >
        {isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
      </button>
      {isLoading && <p style={styles.loading}>⏳ Traitement en cours...</p>}
      {aiResponse && <p style={styles.aiResponse}>{aiResponse}</p>}
    </div>
  );
}

// Styles
const styles = {
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  button: {
    fontSize: "16px",
    padding: "12px 20px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  loading: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#6c757d",
  },
  aiResponse: {
    marginTop: "15px",
    fontSize: "16px",
    fontStyle: "italic",
    color: "#17a2b8",
    maxWidth: "80%",
  },
};
