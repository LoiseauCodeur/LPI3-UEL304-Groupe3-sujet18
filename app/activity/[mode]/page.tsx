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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <a href="/" className="mt-6 text-blue-500 hover:underline">Retour à l'accueil</a>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <Recorder mode={recorderMode} promptKey={mode} maxExchanges={maxExchanges} refreshHistory={fetchConversations}  />

      {/* Historique */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Historique</h2>

        {isFetching ? (
          <p className="text-gray-500 text-center">Chargement...</p>
        ) : filteredConversations.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 bg-gray-100 rounded-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Titre</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conversation) => (
                <tr key={conversation._id} className="hover:bg-gray-50">
                  <td 
                    className="border border-gray-300 px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    {conversation.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(conversation.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => deleteConversation(conversation._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">Aucun historique de conversation disponible pour ce scénario.</p>
        )}
      </div>

      <ConversationModal conversation={selectedConversation} onClose={() => setSelectedConversation(null)} />
    </div>
  );
}
