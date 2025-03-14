"use client";

import Link from "next/link";

export default function Home() {
  const recorderModes = [
    { mode: "single", title: "Pratiquer un exposé oral", key: "studentOralPresentation" },
    { mode: "conversation", title: "Simuler un entretien d'embauche", key: "jobInterview" },
    { mode: "conversation", title: "Simuler une réunion professionnelle", key: "meetingPresentation" },
    { mode: "single", title: "Obtenir le résumé d'un discours", key: "oralSessionSummary" },
    { mode: "single", title: "Améliorer son expression", key: "reformulation" },
    { mode: "single", title: "Générer un script de discours", key: "speechScriptGeneration" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-2xl font-bold mb-6">Choisissez une activité :</h1>
      <div className="space-y-4">
        {recorderModes.map(({ mode, title, key }) => (
          <Link 
            key={key} 
            href={`/activity/${key}`} 
            className="text-blue-600 hover:underline block"
          >
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}
