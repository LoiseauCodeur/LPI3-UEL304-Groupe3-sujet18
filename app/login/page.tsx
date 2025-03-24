"use client";

import { signIn, getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const Login = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [csrf, setCsrf] = useState<string | null>(null); 

  useEffect(() => {
    const fetchCsrf = async () => {
      const token = await getCsrfToken();
      if (!token) {
        message.error("Impossible de récupérer le CSRF token");
      }
      setCsrf(token || null);
    };
    fetchCsrf();
  }, []);
  

  const onFinish = async (values: any) => {
    setLoading(true);

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      csrfToken: csrf, 
      redirect: false,
    });

    console.log("Response:", res);
    if (!res?.ok) {
      message.error(res?.error || "Échec de la connexion");
    }

    if (res?.ok) {
      const session = await fetch("/api/auth/session").then(res => res.json());
      console.log("Session :", session);
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center !mt-0 md:mt-24">
      <Card
        title={<h2 className="text-blue-600 text-center">Connexion</h2>}
        className="w-full max-w-md border border-blue-100 shadow-lg"
      >
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<Text className="text-blue-800">Email</Text>}
            name="email"
            rules={[{ required: true, type: "email", message: "Email valide requis" }]}
          >
            <Input className="bg-blue-50 text-blue-800 border border-blue-300" />
          </Form.Item>

          <Form.Item
            label={<Text className="text-blue-800">Mot de passe</Text>}
            name="password"
            rules={[{ required: true, message: "Mot de passe requis" }]}
          >
            <Input.Password className="bg-blue-50 text-blue-800 border border-blue-300" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-blue-600 border-none hover:bg-blue-500 text-white font-semibold"
          >
            Se connecter
          </Button>

          <div className="text-center mt-4">
            <Text className="text-blue-800">Pas encore de compte ? </Text>
            <Button
              type="link"
              onClick={() => router.push("/signup")}
              className="text-blue-500"
            >
              Créer un compte
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
