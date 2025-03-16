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

    if (res?.ok) {
      const session = await fetch("/api/auth/session").then(res => res.json());
      console.log("Session :", session);
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card
        title={<h2 className="text-yellow-400 text-center">Connexion</h2>}
        className="w-full max-w-md bg-gray-800 border border-yellow-500/30 shadow-lg"
      >
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<Text className="text-white">Email</Text>}
            name="email"
            rules={[{ required: true, type: "email", message: "Email valide requis" }]}>
            <Input className="bg-gray-700 text-yellow-600 border border-yellow-500" />
          </Form.Item>

          <Form.Item
            label={<Text className="text-white">Mot de passe</Text>}
            name="password"
            rules={[{ required: true, message: "Mot de passe requis" }]}>
            <Input.Password className="bg-gray-700 text-yellow-600 border border-yellow-500" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-yellow-500 border-none hover:bg-yellow-400 text-black font-semibold"
          >
            Se connecter
          </Button>

          <div className="text-center mt-4">
            <Text className="text-white">Pas encore de compte ? </Text>
            <Button
              type="link"
              onClick={() => router.push("/signup")}
              className="text-yellow-400"
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
