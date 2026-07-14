import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description: "Демонстрационное согласие на обработку персональных данных проекта LeadFlow.",
};

export default function ConsentPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Согласие на обработку персональных данных
        </h1>

        <Alert className="mt-6">
          <AlertTitle>Демонстрационный документ</AlertTitle>
          <AlertDescription>
            Этот текст является демонстрационным и создан для портфельного проекта LeadFlow.
            Перед реальным коммерческим использованием документ требует юридической проверки.
          </AlertDescription>
        </Alert>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">1. Предмет согласия</h2>
            <p>
              Отправляя форму заявки на сайте LeadFlow, вы даёте согласие на обработку
              указанных вами персональных данных: имени, телефона, а также email, названия
              компании и комментария, если они заполнены.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">2. Цель обработки</h2>
            <p>Данные обрабатываются исключительно для связи по вашей заявке.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">3. Срок действия согласия</h2>
            <p>
              Согласие действует до момента завершения обработки заявки или до отзыва
              согласия по запросу на hello@leadflow.dev.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">4. Отзыв согласия</h2>
            <p>
              Вы можете отозвать согласие в любой момент, написав на контактный email,
              указанный в подвале сайта.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
