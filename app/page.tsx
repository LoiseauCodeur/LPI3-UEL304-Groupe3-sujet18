"use client";

import Recorder from "@/components/Recorder";

export default function Home() {
  return (
    <div>
      <h1>Record & Transcribe</h1>
      <Recorder />
    </div>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import RecordRTC from "recordrtc";

// export default function Home() {
//   const [hydrated, setHydrated] = useState(false);
//   const [input, setInput] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [recorder, setRecorder] = useState<RecordRTC | null>(null);

//   useEffect(() => {
//     setHydrated(true);
//   }, []);

//   if (!hydrated) return null;

//   // 🎤 Start Recording
//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const newRecorder = new RecordRTC(stream, { type: "audio" });
//     newRecorder.startRecording();
//     setRecorder(newRecorder);
//   };

//   // 🛑 Stop Recording and Transcribe
//   const stopRecording = async () => {
//     if (!recorder) return;

//     recorder.stopRecording(async () => {
//       const blob = recorder.getBlob();
//       const formData = new FormData();
//       formData.append("audio", blob, "audio.webm");

//       setLoading(true);
//       setError(null);

//       try {
//         const res = await fetch("/api/transcribe", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Transcription failed");

//         setInput(data.transcription); // Set transcribed text as input
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unexpected error occurred");
//       } finally {
//         setLoading(false);
//       }
//     });
//   };

//   // 📨 Send Message to AI
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userInput: input }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Something went wrong");

//       setResponse(data.message);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
//       <h1>Chat with AI</h1>
      
//       <button onMouseDown={startRecording} onMouseUp={stopRecording} style={{ padding: "10px", marginBottom: "10px" }}>
//         🎤 Hold to Speak
//       </button>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter your message..."
//           required
//           style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//         />
//         <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
//           {loading ? "Thinking..." : "Send"}
//         </button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {response && (
//         <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
//           <strong>AI Response:</strong>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client"; 

// import { useState, useEffect } from "react";

// export default function Home() {
//   const [hydrated, setHydrated] = useState(false); 
//   const [input, setInput] = useState(""); 
//   const [response, setResponse] = useState(""); 
//   const [loading, setLoading] = useState(false); 
//   const [error, setError] = useState<string|null>(null); 

//   useEffect(() => {
//     setHydrated(true);
//   }, []);

//   if (!hydrated) return null;

//   const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userInput: input }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

//       setResponse(data.message);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
//       <h1>Discuter avec l'IA</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Entrez votre message..."
//           required
//           style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//         />
//         <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
//           {loading ? "Réflexion en cours..." : "Envoyer"}
//         </button>
//       </form>
      
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {response && (
//         <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
//           <strong>Réponse de l'IA :</strong>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// }
