"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useRouter } from "next/navigation";
import "antd/dist/reset.css";
import { toast } from "react-hot-toast";

const { Text, Title } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Cet utilisateur existe déjà. Veuillez vous connecter.");
        } else {
          toast.error(data.error || "Une erreur est survenue !");
        }
        setLoading(false);
        return;
      }
  
      toast.success("Inscription réussie ! Redirection...");
      router.push("/login");
    } catch (error) {
      console.error("Erreur attrapée:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center md-mt-36">
      <Card
        title={<Title level={2} className=" text-center">Inscription</Title>}
        className="w-full max-w-md border border-white/30 shadow-lg"
      >
        <Form layout="vertical" onFinish={onFinish} noValidate>
          <Form.Item
            label={<Text>Nom d'utilisateur</Text>}
            name="username"
            rules={[{ required: true, message: "Veuillez entrer un nom d'utilisateur" }]}
          >
            <Input className="bg-blue-200 border border-white" />
          </Form.Item>

          <Form.Item
            label={<Text className="">Email</Text>}
            name="email"
            rules={[
              { required: true, message: "Veuillez entrer un email" },
              { type: "email", message: "Email invalide" },
            ]}
          >
            <Input className="bg-blue-200 border border-white" />
          </Form.Item>

          <Form.Item
            label={<Text >Mot de passe</Text>}
            name="password"
            rules={[
              { required: true, message: "Veuillez entrer un mot de passe" },
              { min: 6, message: "Au moins 6 caractères" },
            ]}
          >
            <Input.Password className="bg-blue-200  border border-white" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-blue-600 border-none hover:bg-gray-300font-semibold"
          >
            S'inscrire
          </Button>

          <div className="text-center mt-4">
            <Text className="">Déjà un compte ? </Text>
            <Button
              type="link"
              onClick={() => router.push("/login")}
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