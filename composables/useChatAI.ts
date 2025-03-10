export async function sendToChatAI(text: string, promptKey: string) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text, promptKey }),
    });
  
    const data = await response.json();
    return response.ok ? data.reply : null;
  }
  