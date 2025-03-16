"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useRouter } from "next/navigation";
import "antd/dist/reset.css";
import { toast } from "react-hot-toast";

const { Text, Title } = Typography;
console.log("test 1"); // Vérifie si l'appel se fait bien

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    console.log("test 2"); // Vérifie si l'appel se fait bien

    setLoading(true);
    console.log("➡️ Envoi des données:", values);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      console.log("📥 Réponse reçue:", response);

      // Vérifie si la réponse a un contenu JSON
      let data: { error?: string } = {};
      try {
        data = await response.json();
        console.log("✅ JSON parsé:", data);
      } catch (jsonError) {
        console.error("❌ Erreur parsing JSON:", jsonError);
      }

      if (!response.ok) {
        console.log("🚨 Erreur API détectée:", data);

        if ("error" in data) {
          toast.error(data.error);  
        } else {
          console.log("🔴 Affichage message d'erreur générique");
          toast.error("Une erreur est survenue !");
        }

        setLoading(false);
        return;
      }

      toast.success("Inscription réussie ! Redirection...");
      router.push("/login");
    } catch (error) {
      console.error("❌ Erreur attrapée:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card
        title={<Title level={2} className="!text-yellow-400 text-center">Inscription</Title>}
        className="w-full max-w-md bg-gray-800 border border-yellow-500/30 shadow-lg"
      >
        <Form layout="vertical" onFinish={onFinish} noValidate>
          <Form.Item
            label={<Text className="text-white">Nom d'utilisateur</Text>}
            name="username"
            rules={[{ required: true, message: "Veuillez entrer un nom d'utilisateur" }]}
          >
            <Input className="bg-gray-700 text-yellow-600 border border-yellow-500" />
          </Form.Item>

          <Form.Item
            label={<Text className="text-white">Email</Text>}
            name="email"
            rules={[
              { required: true, message: "Veuillez entrer un email" },
              { type: "email", message: "Email invalide" },
            ]}
          >
            <Input className="bg-gray-700 text-yellow-600 border border-yellow-500" />
          </Form.Item>

          <Form.Item
            label={<Text className="text-white">Mot de passe</Text>}
            name="password"
            rules={[
              { required: true, message: "Veuillez entrer un mot de passe" },
              { min: 6, message: "Au moins 6 caractères" },
            ]}
          >
            <Input.Password className="bg-gray-700 text-yellow-600 border border-yellow-500" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-yellow-500 border-none hover:bg-yellow-400 text-black font-semibold"
          >
            S'inscrire
          </Button>

          <div className="text-center mt-4">
            <Text className="text-white">Déjà un compte ? </Text>
            <Button
              type="link"
              onClick={() => router.push("/login")}
              className="text-yellow-400"
            >
              Se connecter
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
