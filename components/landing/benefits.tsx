import {
  Bell,
  Database,
  FileText,
  Plug,
  Smartphone,
  Code,
  TestTube2,
} from "lucide-react";

const BENEFITS = [
  {
    icon: Smartphone,
    title: "Адаптивный интерфейс",
    description: "Сайт одинаково удобно выглядит на телефоне, планшете и десктопе.",
  },
  {
    icon: Bell,
    title: "Формы и уведомления",
    description: "Заявки с сайта сразу попадают к менеджеру — без ручной проверки почты.",
  },
  {
    icon: Database,
    title: "База данных",
    description: "Все заявки и данные хранятся в защищённой базе, а не в таблицах на компьютере.",
  },
  {
    icon: Plug,
    title: "Интеграции по API",
    description: "Подключаем сайт к мессенджерам, CRM и внутренним сервисам компании.",
  },
  {
    icon: TestTube2,
    title: "Тестирование сценария",
    description: "Проверяем основной пользовательский путь перед передачей проекта.",
  },
  {
    icon: FileText,
    title: "Инструкция по использованию",
    description: "Передаём понятное описание того, как пользоваться готовым решением.",
  },
  {
    icon: Code,
    title: "Исходный код",
    description: "Вы получаете полный доступ к репозиторию и можете развивать проект дальше.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-20 border-b border-border bg-secondary/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Что получает клиент
          </h2>
          <p className="mt-3 text-muted-foreground">
            Не просто макет, а рабочее решение с понятной документацией.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <benefit.icon className="size-5" />
              </span>
              <h3 className="font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
