// ============================================
// PÁGINA: CADASTRO
// ============================================
// Formulário de registro de novo cliente
// Validação de CPF
// Aceite de termos e promoções (LGPD)
// ============================================

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { Eye, EyeOff } from "lucide-react";
import { validateCpf, formatCpf } from "@/common/helpers/format-cpf";
import { formatPhone } from "@/common/helpers/format-phone";

export default function CadastroPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  // ============================================
  // ESTADOS DO FORMULÁRIO
  // ============================================
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birth_date: "",
    phone: "",
    phone_alternative: "",
    email: "",
    password: "",
    confirmPassword: "",
    accept_terms: false,
    accept_promotions: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // REDIRECIONAR SE JÁ ESTIVER AUTENTICADO
  // ============================================
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/cardapio");
    }
  }, [isAuthenticated, router]);

  // ============================================
  // ATUALIZAR CAMPO DO FORMULÁRIO
  // ============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Formatações automáticas
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCpf(value);
    } else if (name === "phone" || name === "phone_alternative") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ============================================
  // VALIDAR FORMULÁRIO
  // ============================================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Informe nome e sobrenome";
    }

    // CPF
    if (!formData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCpf(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    // Data de nascimento
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.birth_date = "Você deve ter pelo menos 18 anos";
      }
    } else {
      newErrors.birth_date = "Data de nascimento é obrigatória";
    }

    // Telefone
    if (!formData.phone) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (formData.phone.replaceAll(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone inválido";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Senha
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    // Confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não conferem";
    }

    // Aceite de termos
    if (!formData.accept_terms) {
      newErrors.accept_terms = "Você deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // SUBMETER FORMULÁRIO
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Remover formatação do CPF e telefones
      const cleanData = {
        ...formData,
        cpf: formData.cpf.replaceAll(/\D/g, ""),
        phone: formData.phone.replaceAll(/\D/g, ""),
        phone_alternative:
          formData.phone_alternative?.replaceAll(/\D/g, "") || undefined,
      };

      await register(cleanData);
    } catch (error: unknown) {
      console.error("Erro ao registrar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro - Pizzaria Massa Nostra</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
          {/* ============================================ */}
          {/* LOGO */}
          {/* ============================================ */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🍕
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Criar Conta</h1>
            <p className="text-gray-600 mt-2">Cadastre-se para fazer pedidos</p>
          </div>

          {/* ============================================ */}
          {/* FORMULÁRIO */}
          {/* ============================================ */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="João Silva"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* CPF e Data de Nascimento (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CPF *
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.cpf ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="birth_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data de Nascimento *
                </label>
                <input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.birth_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.birth_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birth_date}
                  </p>
                )}
              </div>
            </div>

            {/* Telefones (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="(38) 99999-9999"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone_alternative"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefone Alternativo
                </label>
                <input
                  id="phone_alternative"
                  name="phone_alternative"
                  type="tel"
                  value={formData.phone_alternative}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="(38) 98888-8888"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Senhas (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Senha *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Checkboxes (LGPD) */}
            <div className="space-y-3">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="accept_terms"
                  checked={formData.accept_terms}
                  onChange={handleChange}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Aceito os{" "}
                  <Link
                    href="/termos-de-uso"
                    className="text-red-600 hover:underline"
                  >
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/politica-privacidade"
                    className="text-red-600 hover:underline"
                  >
                    política de privacidade
                  </Link>{" "}
                  *
                </span>
              </label>
              {errors.accept_terms && (
                <p className="text-red-500 text-xs">{errors.accept_terms}</p>
              )}

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="accept_promotions"
                  checked={formData.accept_promotions}
                  onChange={handleChange}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Quero receber promoções e novidades por email
                </span>
              </label>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cadastrando..." : "Criar Conta"}
            </button>
          </form>

          {/* ============================================ */}
          {/* LINKS */}
          {/* ============================================ */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-red-600 font-semibold hover:underline"
              >
                Faça login
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
