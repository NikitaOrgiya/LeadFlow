import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceRange } from "@/lib/utils/currency";

export const metadata: Metadata = {
  title: "Заявка отправлена",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{
    number?: string;
    service?: string;
    min?: string;
    max?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const leadNumber = params.number;
  const serviceName = params.service;
  const min = Number(params.min);
  const max = Number(params.max);
  const hasEstimate = Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0;

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-8" />
            </span>

            {leadNumber ? (
              <>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Заявка {leadNumber} принята
                </h1>
                {serviceName && (
                  <p className="text-sm text-muted-foreground">Услуга: {serviceName}</p>
                )}
                {hasEstimate && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-6 py-4">
                    <p className="text-sm text-muted-foreground">Предварительная стоимость:</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      {formatPriceRange(min, max)}
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Мы изучим описание задачи и свяжемся с вами для уточнения требований.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Заявка отправлена
                </h1>
                <p className="text-sm text-muted-foreground">
                  Мы изучим описание задачи и свяжемся с вами для уточнения требований.
                </p>
              </>
            )}

            <Button asChild className="mt-2">
              <Link href="/">На главную</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
