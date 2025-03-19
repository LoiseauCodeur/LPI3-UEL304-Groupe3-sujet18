"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Recorder from "@/components/Recorder";
import { useConversations, Conversation } from "@/composables/useConversations";
import ConversationModal from "@/components/ConversationModal";

const recorderConfigs: Record<string, { mode: "single" | "conversation"; title: string; maxExchanges?: number }> = {
  studentOralPresentation: { mode: "single", title: "Pratiquer un exposé oral" },
  jobInterview: { mode: "conversation", title: "Simuler un entretien d'embauche", maxExchanges: 5 },
  meetingPresentation: { mode: "conversation", title: "Simuler une réunion professionnelle", maxExchanges: 2 },
  oralSessionSummary: { mode: "single", title: "Obtenir le résumé d'un discours" },
  reformulation: { mode: "single", title: "Améliorer son expression" },
  speechScriptGeneration: { mode: "single", title: "Générer un script de discours" },
};

export default function RecorderPage() {
  const params = useParams();
  const mode = params?.mode as string | undefined;
  const { conversations, fetchConversations, deleteConversation, loading } = useConversations();

  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  useEffect(() => {
    if (mode) {
      setIsFetching(true);
      fetchConversations().finally(() => setIsFetching(false));
    }
  }, [mode]);

  useEffect(() => {
    if (mode && conversations) {
      setFilteredConversations(conversations.filter((conv: Conversation) => conv.scenario === mode));
    }
  }, [mode, conversations]);

  if (!mode || typeof mode !== "string" || !recorderConfigs[mode]) {
    return <p className="text-center text-red-500">Mode non trouvé</p>;
  }

  const { title, mode: recorderMode, maxExchanges } = recorderConfigs[mode];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8ffff]">
      {/* Header */}
      <header className="bg-[#004aad] text-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-center md:justify-start px-6">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo AI Speech Trainer" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold hidden md:block">AI Speech Trainer</h1>
          </a>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex flex-col items-center flex-grow p-6">
        <a href="/" className="mt-4 text-[#004aad] hover:underline font-semibold">
          ◀ Retour à l'accueil
        </a>

        <h1 className="text-3xl font-bold text-[#004aad] mt-4">{title}</h1>
        
        <Recorder 
          mode={recorderMode} 
          promptKey={mode} 
          maxExchanges={maxExchanges} 
          refreshHistory={fetchConversations}  
        />

        {/* Historique */}
        <div className="mt-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-[#004aad] mb-4">📜 Historique</h2>

          {isFetching ? (
            <p className="text-[#004aad] text-center">⏳ Chargement...</p>
          ) : filteredConversations.length > 0 ? (
            <table className="w-full border-collapse border border-[#004aad] bg-[#a8d2e9] rounded-md shadow-lg">
              <thead>
                <tr className="bg-[#004aad] text-white">
                  <th className="border border-[#004aad] px-4 py-2 text-left">Titre</th>
                  <th className="border border-[#004aad] px-4 py-2 text-left">Date</th>
                  <th className="border border-[#004aad] px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conversation) => (
                  <tr key={conversation._id} className="hover:bg-[#f8ffff] transition">
                    <td 
                      className="border border-[#004aad] px-4 py-2 text-[#004aad] cursor-pointer hover:underline"
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      {conversation.title}
                    </td>
                    <td className="border border-[#004aad] px-4 py-2 text-[#004aad]">
                      {new Date(conversation.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border border-[#004aad] px-4 py-2 text-center">
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={() => deleteConversation(conversation._id)}
                      >
                        🗑 Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[#004aad] text-center">Aucun historique de conversation disponible pour ce scénario.</p>
          )}
        </div>

        <ConversationModal 
          conversation={selectedConversation} 
          onClose={() => setSelectedConversation(null)} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-[#004aad] text-white py-3 text-sm text-center">
        © {new Date().getFullYear()} AI Speech Trainer - Tous droits réservés
      </footer>
    </div>
  );
}
