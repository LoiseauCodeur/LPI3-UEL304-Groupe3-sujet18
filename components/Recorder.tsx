import { useState, useRef } from "react";

export default function Recorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start Recording
  const startRecording = async () => {
    console.log("🎤 Starting recording...");
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
      console.log("✅ Transcription response:", data);
    } catch (error) {
      console.error("❌ Error sending audio to backend:", error);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording (Sending to Whisper...)" : "Start Recording"}
      </button>
    </div>
  );
}
