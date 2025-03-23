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

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: any;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper session={session}>
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
    <div className="flex items-center justify-between p-6 relative z-10 w-10/12 m-auto">
      <Image src="/logo1.png" alt="Logo" width={150} height={150} className="mx-auto" />
      {status === "authenticated" && userInfo ? (
        <div className="relative">
          <button onClick={() => setShowInfo(!showInfo)} className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold absolute">
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
