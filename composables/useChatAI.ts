export async function sendToChatAI(userInput: string, promptKey: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: userInput, promptKey }),
  });

  const text = await response.text();
  if (!text) {
    console.error("Response body is empty");
    return null;
  }

  try {
    const data = JSON.parse(text);
    return response.ok ? data.reply : null;
  } catch (error) {
    console.error("Error parsing JSON:", error, "Response text:", text);
    return null;
  }
}
