"use client";

import { useParams } from "next/navigation";
import Recorder from "@/components/Recorder";
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

   

  if (!mode || typeof mode !== "string" || !recorderConfigs[mode]) {
    return <p className="text-center text-red-500">Mode non trouvé</p>;
  }

  const { title, mode: recorderMode, maxExchanges } = recorderConfigs[mode];

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#232323] to-[#333232] p-6">
      <div className="bg-[#1a1a1a] shadow-lg rounded-2xl p-8 max-w-lg w-full text-center border border-[#c0bb39]/30">
        
        <h1 className="text-3xl font-extrabold text-[#c0bb39] mb-6">{title}</h1>

        <Recorder mode={recorderMode} promptKey={mode} maxExchanges={maxExchanges} />

        <Link 
          href="/" 
          className="inline-block mt-6 bg-[#6d1717] text-[#c0bb39] font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:bg-[#580f0f] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c0bb39]/50"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
