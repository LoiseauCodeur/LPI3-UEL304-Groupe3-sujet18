"use client";

import { useParams } from "next/navigation";
import Recorder from "@/components/Recorder";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <a href="/" className="mt-6 text-blue-500 hover:underline">Retour à l'accueil</a>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <Recorder mode={recorderMode} promptKey={mode} maxExchanges={maxExchanges} />
    </div>
  );
}
