// ============================================
// PÁGINA: LOGIN
// ============================================
// Página responsável por autenticar o usuário.
// Caso já esteja logado, redireciona para o cardápio.
// Possui campos para email/telefone e senha, com toggle de visibilidade.
// ============================================

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  // ============================================
  // CONTEXTOS E HOOKS
  // ============================================
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // ============================================
  // ESTADOS LOCAIS
  // ============================================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================
  // REDIRECIONAMENTO SE AUTENTICADO
  // ============================================
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/cardapio");
    }
  }, [isAuthenticated, router]);

  // ============================================
  // FUNÇÃO DE SUBMISSÃO DO FORMULÁRIO
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Tentando fazer login...", { username });

    try {
      await login({ username, password });
      console.log("Login bem-sucedido!");
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error?.response?.data) {
        console.error("Resposta da API:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* Cabeçalho da página */}
      <Head>
        <title>Login - Pizzaria Massa Nostra</title>
      </Head>

      {/* Container centralizado */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🍕
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Massa Nostra</h1>
            <p className="text-gray-600 mt-2">Faça login para continuar</p>
          </div>

          {/* Formulário de login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo: Email ou Telefone */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email ou Telefone
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="seu@email.com ou (38) 99999-9999"
                required
              />
            </div>

            {/* Campo: Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 text-gray-900 bg-white"
                  placeholder="••••••••"
                  required
                />
                {/* Toggle de visibilidade da senha */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Links auxiliares */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link
                href="/cadastro"
                className="text-red-600 font-semibold hover:underline"
              >
                Cadastre-se
              </Link>
            </p>

            <Link href="/" className="block text-gray-500 hover:text-gray-700">
              Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
