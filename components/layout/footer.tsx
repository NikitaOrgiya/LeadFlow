import Link from "next/link";
import { Mail, Send, Zap } from "lucide-react";

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#benefits", label: "Возможности" },
  { href: "#process", label: "Процесс" },
  { href: "#calculator", label: "Стоимость" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            <span className="text-lg">LeadFlow</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Разрабатываем сайты, Telegram-ботов и цифровые сервисы для малого и среднего
            бизнеса — от идеи до рабочего прототипа.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Навигация</h3>
          <nav className="flex flex-col gap-2" aria-label="Навигация в подвале">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Контакты</h3>
          <a
            href="mailto:hello@leadflow.dev"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
            hello@leadflow.dev
          </a>
          <a
            href="https://t.me/leadflow_demo"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Send className="size-4" />
            @leadflow_demo
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} LeadFlow. Демонстрационный портфельный проект.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Политика конфиденциальности
            </Link>
            <Link href="/consent" className="transition-colors hover:text-foreground">
              Обработка персональных данных
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
