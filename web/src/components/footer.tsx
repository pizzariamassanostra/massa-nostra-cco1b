import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Pizzaria Massa Nostra"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400">
              As melhores pizzas da região, feitas com ingredientes frescos e
              massa artesanal.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
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

          {/* Redes Sociais */}
          <div>
            <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Image
                  src="/facebook. svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href="https://wa.me/5538999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Image
                  src="/whatsapp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href="https://t.me/pizzariamassanostra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Image
                  src="/telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Pizzaria Massa Nostra. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
