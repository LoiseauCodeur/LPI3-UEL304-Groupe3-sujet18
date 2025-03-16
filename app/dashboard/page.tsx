import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>Bienvenue sur le Dashboard</h1>
      <p>Connecté en tant que {session?.user?.email}</p>
    </div>
  );
}
