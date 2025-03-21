"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
    <div className="flex items-stretch min-h-screen bg-gradient-to-b from-[#0A0F1A] to-[#1C1C2A] p-6">
      {/* Section Informations Utilisateur */}
      <div className="flex flex-col w-1/4 p-6 bg-[#1A1A2E] rounded-2xl shadow-lg text-white h-full">
        {session && (
          <>
            <Image
              src={session.user?.image || "/default-avatar.png"}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full mx-auto"
            />
            <h2 className="text-2xl font-bold text-center mt-4">{session.user?.name}</h2>
            <p className="text-center text-gray-400">{session.user?.email}</p>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Section Activités */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 h-full">
        {recorderModes.map(({ title, key, icon }) => (
          <Link
            key={key}
            href={`/activity/${key}`}
            className="group relative block w-full h-80"
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
                <div className="card__back absolute top-0 bottom-0 right-0 left-0 p-8 bg-opacity-60 bg-[#1A1A2E] text-white flex items-center justify-center rounded-xl shadow-lg transform rotate-y-180">
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
  );
}
