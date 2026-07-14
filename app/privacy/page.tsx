import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Демонстрационная политика конфиденциальности проекта LeadFlow.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Политика конфиденциальности
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
            <h2 className="mb-2 text-lg font-semibold text-foreground">1. Общие положения</h2>
            <p>
              LeadFlow уважает конфиденциальность посетителей сайта. Настоящая политика
              описывает, какие данные собираются при заполнении формы заявки и как они
              используются.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">2. Какие данные собираются</h2>
            <p>
              При отправке заявки мы получаем имя, телефон, а также, если указано, email,
              название компании и комментарий к задаче.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">3. Цель обработки</h2>
            <p>
              Данные используются исключительно для связи с потенциальным клиентом и
              обсуждения проекта. Данные не передаются третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">4. Хранение данных</h2>
            <p>
              Заявки хранятся в защищённой базе данных с ограниченным доступом только для
              администраторов проекта.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">5. Контакты</h2>
            <p>По вопросам обработки данных вы можете написать на hello@leadflow.dev.</p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
