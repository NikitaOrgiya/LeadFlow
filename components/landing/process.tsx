const STEPS = [
  {
    title: "Анализ задачи",
    description: "Обсуждаем цели, пользователей и ограничения проекта.",
  },
  {
    title: "Прототип",
    description: "Собираем структуру интерфейса и согласовываем основной сценарий.",
  },
  {
    title: "Разработка",
    description: "Реализуем интерфейс, серверную логику и интеграции.",
  },
  {
    title: "Проверка",
    description: "Тестируем основной сценарий и устраняем найденные проблемы.",
  },
  {
    title: "Запуск",
    description: "Разворачиваем проект на выбранном хостинге и проверяем его в бою.",
  },
  {
    title: "Передача проекта",
    description: "Передаём исходный код, доступы и инструкцию по использованию.",
  },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Как проходит работа
          </h2>
          <p className="mt-3 text-muted-foreground">
            Шесть понятных этапов от идеи до передачи готового решения.
          </p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
