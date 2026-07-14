import { ArrowRight, Code2, ListChecks, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: ListChecks,
    text: "Понятные этапы разработки",
  },
  {
    icon: Code2,
    text: "Исходный код и документация",
  },
  {
    icon: Rocket,
    text: "Рабочий прототип до масштабирования",
  },
];

export function Hero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Разрабатываем сайты, Telegram-ботов и цифровые сервисы для бизнеса
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            Создаём рабочие MVP, автоматизируем обработку заявок и объединяем сайты,
            мессенджеры и внутренние системы.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#calculator">
                Рассчитать стоимость
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#services">Посмотреть услуги</a>
            </Button>
          </div>

          <ul className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm"
              >
                <item.icon className="size-4 shrink-0 text-primary" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
