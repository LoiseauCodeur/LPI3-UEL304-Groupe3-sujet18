"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{ username: string; createdAt: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.email) {
      fetch(`/api/user?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setUserInfo(data));
    }
  }, [status, router, session]);

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
    <div className="flex min-h-screen bg-gradient-to-b from-[#0A0F1A] to-[#1C1C2A]">
      {/* Section Informations Utilisateur */}
      <div className="flex flex-col w-1/4 p-6 text-white min-h-screen justify-between">
        {session && userInfo && (
          <>
            <div className="p-4 bg-[#0A0F1A] rounded-xl shadow-md flex items-center justify-center">
              <Image src="/logo1.png" alt="Logo" width={150} height={150} />
            </div>
            <div className="flex flex-col items-center">
              <Image
                src={session.user?.image || "/default-avatar.png"}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
              <h2 className="text-2xl font-bold text-center mt-4">{userInfo.username}</h2>
              <p className="text-center text-gray-400">{session.user?.email}</p>
              <p className="text-center text-gray-500">Membre depuis : {new Date(userInfo.createdAt).toLocaleDateString()}</p>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })} 
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
            {/* Statistiques Card */}
            <div className="p-4 bg-[#0A0F1A] rounded-xl shadow-md flex items-center justify-center">
              <Image src="/statistics.png" alt="Statistiques" width={100} height={100} />
              <p className="text-white ml-4">Statistiques Utilisateur</p>
            </div>
          </>
        )}
      </div>

      {/* Section Activités */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {recorderModes.map(({ title, key, icon }) => (
          <Link
            key={key}
            href={`/activity/${key}`}
            className="group relative block w-full h-full"
          >
            <div className="card perspective-800px w-full h-full bg-opacity-70 hover:bg-opacity-80 transition-all duration-300">
              <div className="card__content w-full h-full transition-transform duration-1000 ease-in-out transform-style-preserve-3d">
                <div className="card__front absolute top-0 bottom-0 right-0 left-0 p-8 bg-opacity-60 bg-[#1A1A2E] text-white flex items-center justify-center rounded-xl shadow-lg">
                  <img
                    src={icon}
                    alt={title}
                    className="icon w-3/4 h-3/4 object-contain filter brightness-0" 
                  />
                </div>
                <div className="card__back absolute top-0 bottom-0 right-0 left-0 p-8 bg-opacity-60 bg-[#1A1A2E] text-white flex items-center justify-center rounded-xl shadow-lg transform rotate-y-180">
                  <span className="text-2xl font-bold">{title}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}