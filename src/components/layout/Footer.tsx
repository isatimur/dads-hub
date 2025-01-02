import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Компания",
      links: [
        { label: "О нас", href: "/about" },
        { label: "Контакты", href: "/contact" },
        { label: "Вопросы и ответы", href: "/faq" },
      ],
    },
    {
      title: "Правовая информация",
      links: [
        { label: "Политика конфиденциальности", href: "/privacy-policy" },
        { label: "Условия использования", href: "/terms" },
        { label: "Политика cookies", href: "/cookie-policy" },
      ],
    },
    {
      title: "Поддержка",
      links: [
        { label: "Центр помощи", href: "/help" },
        { label: "Правила сообщества", href: "/guidelines" },
        { label: "Сообщить о проблеме", href: "/contact" },
      ],
    },
    {
      title: "Соцсети",
      links: [
        { label: "ВКонтакте", href: "https://vk.com/otec.molodec" },
        { label: "Telegram", href: "https://t.me/otec.molodec" },
        { label: "Одноклассники", href: "https://ok.ru/otec.molodec" },
      ],
    },
  ];

  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} Отец Молодец. Все права защищены.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-600 text-sm">Сделано с</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span className="text-gray-600 text-sm">для пап по всей России</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 