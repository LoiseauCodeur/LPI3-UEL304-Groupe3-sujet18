export function useTextToSpeech() {
    const playAIResponse = async (text: string) => {
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch speech audio");
        }
    
        const audioData = await response.arrayBuffer();
        const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error("TTS Error:", error);
      }
    };
  
    return { playAIResponse };
  }