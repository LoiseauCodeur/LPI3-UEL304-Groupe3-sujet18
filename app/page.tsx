"use client"; 

import { useState, useEffect } from "react";

export default function Home() {
  const [hydrated, setHydrated] = useState(false); 
  const [input, setInput] = useState(""); 
  const [response, setResponse] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string|null>(null); 

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

      setResponse(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Discuter avec l'IA</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Entrez votre message..."
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
          {loading ? "Réflexion en cours..." : "Envoyer"}
        </button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
          <strong>Réponse de l'IA :</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
