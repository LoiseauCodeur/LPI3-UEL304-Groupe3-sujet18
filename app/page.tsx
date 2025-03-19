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
    <div className="flex flex-col min-h-screen bg-[#f8ffff] text-center text-[#004aad]">
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
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <h2 className="text-3xl font-semibold mb-6">Choisissez une activité :</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {recorderModes.map(({ mode, title, key }) => (
            <Link
              key={key}
              href={`/activity/${key}`}
              className="block p-6 bg-[#a8d2e9] text-[#004aad] rounded-lg shadow-lg hover:bg-[#004aad] hover:text-white transition text-lg font-medium"
            >
              {title}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004aad] text-white py-3 text-sm text-center">
        © {new Date().getFullYear()} AI Speech Trainer - Tous droits réservés
      </footer>
    </div>
  );
}
