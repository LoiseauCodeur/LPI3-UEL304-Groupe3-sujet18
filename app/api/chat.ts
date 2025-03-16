import type { NextApiRequest, NextApiResponse } from "next";
import prompts from "../../config/prompts"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { input, promptKey } = req.body as { input?: string; promptKey?: string };  

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  const prompt = promptKey && prompts[promptKey] ? prompts[promptKey] : 'generic';
  const messages = [
    { role: "system", content: prompt },
    { role: "user", content: input }
  ];


  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", 
        messages,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch response" });
  }
}
