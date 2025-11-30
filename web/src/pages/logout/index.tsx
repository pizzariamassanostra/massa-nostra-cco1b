// ============================================
// PÁGINA: LOGOUT
// ============================================
// Página responsável por encerrar a sessão do usuário.
// Limpa dados do localStorage e redireciona para a tela de login.
// Exibe um indicador de carregamento enquanto processa.
// ============================================

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { CircularProgress } from "@nextui-org/progress";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Limpar todos os dados armazenados no navegador
    localStorage.clear();

    // Redirecionar usuário para página de login
    router.push("/login");
  }, [router]); // Dependência garante execução correta no React

  return (
    // Container centralizado com indicador de progresso
    <div className="w-full h-full flex justify-center items-center">
      <CircularProgress
        classNames={{
          svg: "w-24 h-24", // Define tamanho do spinner
        }}
      />
    </div>
  );
};

export default LogoutPage;
