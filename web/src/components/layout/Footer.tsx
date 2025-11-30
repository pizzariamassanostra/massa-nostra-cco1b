// ============================================
// COMPONENTE: FOOTER DO SITE
// ============================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ============================================ */}
          {/* COLUNA 1: SOBRE */}
          {/* ============================================ */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-2xl">
                🍕
              </div>
              <span className="text-xl font-bold">Massa Nostra</span>
            </div>
            <p className="text-gray-400 text-sm">
              As melhores pizzas de Montes Claros! Feitas com ingredientes
              frescos e muito amor.
            </p>
          </div>

          {/* ============================================ */}
          {/* COLUNA 2: LINKS RÁPIDOS */}
          {/* ============================================ */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cardapio"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cardápio
                </Link>
              </li>
              <li>
                <Link
                  href="/meus-pedidos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link
                  href="/suporte"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* ============================================ */}
          {/* COLUNA 3: CONTATO */}
          {/* ============================================ */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>(38) 3221-0000</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contato@massanostra.com. br</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  Av. Exemplo, 1000
                  <br />
                  Centro - Montes Claros/MG
                </span>
              </li>
            </ul>
          </div>

          {/* ============================================ */}
          {/* COLUNA 4: REDES SOCIAIS */}
          {/* ============================================ */}
          <div>
            <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5538999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="WhatsApp"
              >
                <Image
                  src="/whatsapp.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                />
              </a>
            </div>

            {/* Horário de Funcionamento */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Horário</h4>
              <p className="text-sm text-gray-400">
                Seg - Sex: 18h - 23h
                <br />
                Sáb - Dom: 18h - 00h
              </p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* DIVISOR */}
        {/* ============================================ */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} Pizzaria Massa Nostra. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
