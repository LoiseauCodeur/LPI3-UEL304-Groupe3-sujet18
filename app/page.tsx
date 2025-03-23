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
  const [showInfo, setShowInfo] = useState(false);

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
    return <p className="text-blue-500 text-center mt-10">Chargement...</p>;
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
    <div className="flex flex-col h-2/4 mt-10 overflow-hidden">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 px-32 md-px-32 py-8">
        {recorderModes.map(({ title, key, icon }) => (
          <Link key={key} href={`/activity/${key}`} className="group relative block w-full h-48 cursor-pointer">
            <div className="card perspective-800px w-full h-full rounded-xl overflow-hidden transition-transform transform-style-preserve-3d">
              <div className="card__content w-full h-full transition-transform duration-1000 ease-in-out">
                <div className="card__front absolute top-0 bottom-0 right-0 left-0 p-8 text-white flex items-center justify-center rounded-xl shadow-lg bg-blue-500">
                  <Image src={icon} alt={title} width={80} height={80} className="filter brightness-0 invert" />
                </div>
                <div className="card__back absolute top-0 bottom-0 right-0 left-0 p-8 text-white flex items-center justify-center rounded-xl shadow-lg transform rotate-y-180 bg-blue-500">
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
