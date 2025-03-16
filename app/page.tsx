"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login"); 
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-white text-center mt-10">Chargement...</p>;
  }

  const recorderModes = [
    { mode: "single", title: "Pratiquer un exposé oral", key: "studentOralPresentation" },
    { mode: "conversation", title: "Simuler un entretien d'embauche", key: "jobInterview" },
    { mode: "conversation", title: "Simuler une réunion professionnelle", key: "meetingPresentation" },
    { mode: "single", title: "Obtenir le résumé d'un discours", key: "oralSessionSummary" },
    { mode: "single", title: "Améliorer son expression", key: "reformulation" },
    { mode: "single", title: "Générer un script de discours", key: "speechScriptGeneration" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#232323] to-[#333232] p-6">
      <Image
        src="/logo.png"
        alt="Logo de Social AI Academy"
        width={120}
        height={120}
        className="mb-6"
        priority
      />

      <div className="bg-[#1a1a1a] shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-[#c0bb39]/30">
        <h1 className="text-3xl font-extrabold text-[#c0bb39] mb-6">Choisissez une activité</h1>
        <div className="grid gap-4">
          {recorderModes.map(({ title, key }) => (
            <Link
              key={key}
              href={`/activity/${key}`}
              className="block bg-[#6d1717] text-[#c0bb39] font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:bg-[#580f0f] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c0bb39]/50"
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
