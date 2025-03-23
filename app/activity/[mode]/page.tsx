"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Recorder from "@/components/Recorder";
import { useConversations, Conversation } from "@/composables/useConversations";
import ConversationModal from "@/components/ConversationModal";
import Link from "next/link";

const recorderConfigs: Record<string, { mode: "single" | "conversation"; title: string; maxExchanges?: number }> = {
  studentOralPresentation: { mode: "single", title: "Pratiquer un exposé oral" },
  jobInterview: { mode: "conversation", title: "Simuler un entretien d'embauche", maxExchanges: 5 },
  meetingPresentation: { mode: "conversation", title: "Simuler une réunion professionnelle", maxExchanges: 5 },
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
  const [formattedDates, setFormattedDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mode) {
      setIsFetching(true);
      fetchConversations(mode).then(() => {
        setIsFetching(false);
      });
    }
  }, [mode]);
  

  useEffect(() => {
    if (mode && conversations) {
      setFilteredConversations(conversations.filter((conv: Conversation) => conv.scenario === mode));
    }
  }, [mode, conversations]);

  useEffect(() => {
    const newFormattedDates: { [key: string]: string } = {};
    filteredConversations.forEach((conv) => {
      newFormattedDates[conv._id] = new Date(conv.createdAt).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    });
    setFormattedDates(newFormattedDates);
  }, [filteredConversations]);

  if (!mode || typeof mode !== "string" || !recorderConfigs[mode]) {
    return <p className="text-center text-red-500">Mode non trouvé</p>;
  }

  const { title, mode: recorderMode, maxExchanges } = recorderConfigs[mode];

  return (
    <div className="flex flex-col items-center justify-center min-h-screenp-6 text-blue-800">
      <Link href="/" className="mb-6 text-blue-600 hover:underline hover:text-blue-500 transition">
        ← Retour à l'accueil
      </Link>

      <h1 className="text-3xl font-extrabold mb-6">{title}</h1>

      <Recorder mode={recorderMode} promptKey={mode} maxExchanges={maxExchanges} refreshHistory={fetchConversations} />

      <div className="mt-8 w-full max-w-lg bg-white p-6 rounded-lg shadow-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Historique</h2>

        {isFetching ? (
          <p className="text-blue-600 text-center">⏳ Chargement...</p>
        ) : filteredConversations.length > 0 ? (
          <table className="w-full border-collapse border border-blue-200">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="border border-blue-200 px-4 py-2 text-left">Titre</th>
                <th className="border border-blue-200 px-4 py-2 text-left">Date</th>
                <th className="border border-blue-200 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conversation) => (
                <tr key={conversation._id} className="hover:bg-blue-50 transition">
                  <td
                    className="border border-blue-200 px-4 py-2 text-blue-800 cursor-pointer hover:text-blue-600 transition"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    {conversation.title}
                  </td>
                  <td className="border border-blue-200 px-4 py-2 text-blue-800">
                    {formattedDates[conversation._id] || "Chargement..."}
                  </td>
                  <td className="border border-blue-200 px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                      onClick={() => deleteConversation(conversation._id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-blue-600 text-center">Aucun historique de conversation disponible pour ce scénario.</p>
        )}
      </div>

      <ConversationModal conversation={selectedConversation} onClose={() => setSelectedConversation(null)} />
    </div>
  );
}