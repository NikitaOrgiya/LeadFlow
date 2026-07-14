import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Является ли расчёт в калькуляторе окончательной стоимостью?",
    answer:
      "Нет, это предварительная оценка. Точная стоимость определяется после уточнения требований, интеграций и критериев приёмки.",
  },
  {
    question: "Можно ли начать с небольшого MVP?",
    answer:
      "Да, мы обычно рекомендуем начинать с рабочего прототипа, чтобы проверить гипотезу до масштабирования.",
  },
  {
    question: "Передаётся ли исходный код?",
    answer: "Да, после завершения работ вы получаете полный доступ к репозиторию проекта.",
  },
  {
    question: "Можно ли доработать уже существующий продукт?",
    answer:
      "Да, мы беремся за доработку существующих сайтов и сервисов после короткого технического анализа.",
  },
  {
    question: "Какие материалы нужны для начала?",
    answer:
      "Достаточно описания задачи и пожеланий по функциональности — детали уточним на этапе анализа.",
  },
  {
    question: "Как проходит оплата и приёмка?",
    answer:
      "Условия оплаты и этапы приёмки согласовываются индивидуально после обсуждения объёма работ.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Частые вопросы</h2>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
