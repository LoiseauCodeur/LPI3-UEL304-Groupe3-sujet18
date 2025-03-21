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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#232323] to-[#333232] p-6 text-[#c0bb39]">
      <Link href="/" className="mb-6 text-[#c0bb39] hover:underline hover:text-[#d4d054] transition">
        ← Retour à l'accueil
      </Link>

      <h1 className="text-3xl font-extrabold mb-6">{title}</h1>

      <Recorder mode={recorderMode} promptKey={mode} maxExchanges={maxExchanges} refreshHistory={fetchConversations} />

      <div className="mt-8 w-full max-w-lg bg-[#1a1a1a] p-6 rounded-lg shadow-lg border border-[#c0bb39]/30">
        <h2 className="text-xl font-semibold mb-4 text-[#c0bb39]">Historique</h2>

        {isFetching ? (
          <p className="text-[#c0bb39] text-center">⏳ Chargement...</p>
        ) : filteredConversations.length > 0 ? (
          <table className="w-full border-collapse border border-[#c0bb39]/50">
            <thead>
              <tr className="bg-[#2a2a2a] text-[#c0bb39]">
                <th className="border border-[#c0bb39]/50 px-4 py-2 text-left">Titre</th>
                <th className="border border-[#c0bb39]/50 px-4 py-2 text-left">Date</th>
                <th className="border border-[#c0bb39]/50 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conversation) => (
                <tr key={conversation._id} className="hover:bg-[#292929] transition">
                  <td
                    className="border border-[#c0bb39]/50 px-4 py-2 text-[#c0bb39] cursor-pointer hover:text-[#d4d054] transition"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    {conversation.title}
                  </td>
                  <td className="border border-[#c0bb39]/50 px-4 py-2 text-[#c0bb39]">
                    {formattedDates[conversation._id] || "Chargement..."}
                  </td>
                  <td className="border border-[#c0bb39]/50 px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 text-[#c0bb39] bg-[#6d1717] rounded-lg hover:bg-[#580f0f] transition"
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
          <p className="text-[#c0bb39] text-center">Aucun historique de conversation disponible pour ce scénario.</p>
        )}
      </div>

      <ConversationModal conversation={selectedConversation} onClose={() => setSelectedConversation(null)} />
    </div>
  );
}
