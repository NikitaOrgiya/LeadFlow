"use client";

import { Bot, Building2, Clock, Database, LayoutTemplate, Send, Workflow, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { selectServiceAndScroll, useLandingState } from "@/components/landing/landing-state";
import { formatCurrency } from "@/lib/utils/currency";
import { SERVICES, type ServiceIconName } from "@/lib/pricing/pricing-config";

const ICONS: Record<ServiceIconName, LucideIcon> = {
  LayoutTemplate,
  Building2,
  Send,
  Database,
  Workflow,
  Bot,
};

export function Services() {
  const { setServiceSlug } = useLandingState();

  return (
    <section id="services" className="scroll-mt-20 border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Услуги</h2>
          <p className="mt-3 text-muted-foreground">
            Выберите направление — стоимость и опции можно уточнить в калькуляторе ниже.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <Card key={service.slug} className="flex flex-col">
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-3">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
                  <div className="mt-auto flex flex-col gap-1 pt-2 text-sm">
                    <span className="font-semibold text-foreground">
                      от {formatCurrency(service.basePrice)}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" />
                      {service.durationLabel}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => selectServiceAndScroll(setServiceSlug, service.slug)}
                  >
                    Выбрать услугу
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
