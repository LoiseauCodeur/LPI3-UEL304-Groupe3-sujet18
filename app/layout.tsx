"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./SessionProvider";
import "antd/dist/reset.css";
import { Toaster } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <AutoLogout />
          <Header />
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

function Header() {
  const { data: sessionData, status } = useSession();
  const [userInfo, setUserInfo] = useState<{ username: string; createdAt: string } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (sessionData?.user?.email) {
      fetch(`/api/user?email=${sessionData.user.email}`)
        .then((res) => res.json())
        .then((data) => setUserInfo(data));
    }
  }, [sessionData]);

  return (
    <div className="relative w-10/12 m-auto p-6">
      <div className="flex justify-center items-center">
        <Image src="/logo1.png" alt="Logo" width={150} height={150} className="mx-auto" />
      </div>

      {status === "authenticated" && userInfo ? (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
          <button onClick={() => setShowInfo(!showInfo)} className="relative flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
              {userInfo.username[0].toUpperCase()}
            </div>
          </button>
          {showInfo && (
            <div className="absolute right-0 mt-2 p-4 w-64 bg-white shadow-lg rounded-xl z-20">
              <h2 className="text-xl font-bold text-black">{userInfo.username}</h2>
              <p className="text-gray-500">{sessionData.user?.email}</p>
              <p className="text-gray-400">Membre depuis : {new Date(userInfo.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="mt-4 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      ) : (
        <span className="text-gray-500">Non connecté</span>
      )}
    </div>
  );
}

function AutoLogout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut();
        console.log("Déconnexion automatique après 15 minutes d'inactivité.");
      }, 900000); // 15 mins
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    window.addEventListener("click", resetTimeout);

    resetTimeout(); 

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("click", resetTimeout);
    };
  }, [session]);

  return null;
}
