import { useState, useRef } from "react";

export default function Recorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start Recording
  const startRecording = async () => {
    console.log("🎤 Starting recording...");
    setTranscription(null);
    setAiResponse(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      console.log("⏹️ Stopping recording...");
      const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });
      chunksRef.current = [];

      console.log("📤 Sending audio to backend...");
      setIsLoading(true);
      await sendAudioToBackend(audioBlob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    console.log("🛑 Stop button clicked");
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Send recorded audio to backend
  const sendAudioToBackend = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recorded-audio.mp3");

      console.log("📡 Sending FormData to /api/transcribe...");
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("✅ Transcription received:", data);

      if (response.ok && data.text) {
        setTranscription(data.text);
        await sendTranscriptionToAI(data.text);
      } else {
        setTranscription("⚠️ Failed to transcribe audio.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Error sending audio to backend:", error);
      setTranscription("⚠️ Error processing request.");
      setIsLoading(false);
    }
  };

  // Send transcription to ChatGPT API
  const sendTranscriptionToAI = async (text: string) => {
    try {
      console.log("📡 Sending transcription to /api/chat...");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription: text }),
      });

      const data = await response.json();
      console.log("💬 ChatGPT Response:", data);

      if (response.ok && data.reply) {
        setAiResponse(data.reply);
      } else {
        setAiResponse("⚠️ No response from AI.");
      }
    } catch (error) {
      console.error("❌ Error sending transcription to AI:", error);
      setAiResponse("⚠️ Error processing AI request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pratiquer mon exposé oral</h1>
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
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    textAlign: "center" as const,
  },
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
  transcription: {
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#343a40",
    maxWidth: "80%",
  },
  aiResponse: {
    marginTop: "15px",
    fontSize: "16px",
    fontStyle: "italic",
    color: "#17a2b8",
    maxWidth: "80%",
  },
};
