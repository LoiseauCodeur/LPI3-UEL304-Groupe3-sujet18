import { useState, useRef } from "react";

export default function Recorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start Recording
  const startRecording = async () => {
    setChatHistory('');
    setAiResponse(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });
      chunksRef.current = [];
      setIsLoading(true);
      await sendAudioToBackend(audioBlob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Send recorded audio to backend
  const sendAudioToBackend = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recorded-audio.mp3");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.text) {
        console.log('transcription', data.text);
        // Create updated chat history
        const updatedChatHistory = chatHistory + "\n" + "Candidate: " + data.text;
        setChatHistory(updatedChatHistory);

        console.log('chatHistory before sending to AI:', updatedChatHistory);

      // Pass updated chat history directly
      await sendTranscriptionToAI(updatedChatHistory);
      } else {
        setChatHistory((prev) => prev + "\n" + "Failed to transcribe audio");
        setIsLoading(false);
      }
    } catch (error) {
      setChatHistory((prev) => prev + "\n" + "Error processing request.");
      setIsLoading(false);
    }
  };

  // Send transcription to ChatGPT API
  const sendTranscriptionToAI = async (text: string) => {
    console.log('sendTrToAi input' + text);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, promptKey: 'jobInterviewSimulation' }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        console.log('AI response:', data.reply);
        setAiResponse(data.reply);
        setChatHistory((prev) => prev + "\n" + "Coach: " + data.reply);
      } else {
        setAiResponse("⚠️ No response from AI.");
      }
    } catch (error) {
      setAiResponse("⚠️ Error processing AI request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Simuler un entretien d'embauche</h1>
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
