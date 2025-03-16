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
    { mode: "single", title: "Pratiquer un exposé oral", key: "studentOralPresentation", icon: "/speaker.png" },
    { mode: "conversation", title: "Simuler un entretien d'embauche", key: "jobInterview", icon: "/job-interview.png" },
    { mode: "conversation", title: "Simuler une réunion professionnelle", key: "meetingPresentation", icon: "/corporate-discussions.png" },
    { mode: "single", title: "Obtenir le résumé d'un discours", key: "oralSessionSummary", icon: "/summary.png" },
    { mode: "single", title: "Améliorer son expression", key: "reformulation", icon: "/improvement.png" },
    { mode: "single", title: "Générer un script de discours", key: "speechScriptGeneration", icon: "/script.png" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0F1A] to-[#1C1C2A] p-6">
      <div className="rounded-2xl max-w-3xl w-full text-center">
        <h1 className="top-25 text-center text-3xl font-extrabold text-white">Choisissez une activité</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols- gap-6">
          {recorderModes.map(({ title, key, icon }) => (
            <Link
              key={key}
              href={`/activity/${key}`}
              className="group relative block w-full h-64"
            >
              <div className="card perspective-800px w-full h-full bg-opacity-70 hover:bg-opacity-80 transition-all duration-300">
                <div className="card__content w-full h-full transition-transform duration-1000 ease-in-out transform-style-preserve-3d">
                  <div className="card__front absolute top-0 bottom-0 right-0 left-0 p-8 bg-opacity-60 bg-[#1A1A2E] text-white flex items-center justify-center rounded-xl shadow-lg">
                    <div className="p-12 text-black inset-0 flex items-center justify-center">
                      <img
                        src={icon}
                        alt={title}
                        className="icon w-full h-full object-contain filter brightness-0" 
                      />
                    </div>
                  </div>

                  <div className="card__back absolute top-0 bottom-0 right-0 left-0 p-8 bg-opacity-60 bg-[#1A1A2E] text-white flex items-center justify-center rounded-xl shadow-lg transform-rotateY-180">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold">{title}</span>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
