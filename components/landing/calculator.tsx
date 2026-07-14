"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLandingState } from "@/components/landing/landing-state";
import { OPTIONS, SERVICES } from "@/lib/pricing/pricing-config";
import { formatPriceRange } from "@/lib/utils/currency";

export function Calculator() {
  const { serviceSlug, setServiceSlug, optionSelections, setOptionSelections, estimate } =
    useLandingState();

  const setFlag = (id: string, checked: boolean) => {
    setOptionSelections((prev) => ({ ...prev, [id]: checked }));
  };

  const setQuantity = (id: string, value: number, min: number, max?: number) => {
    const clamped = Math.max(min, Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.floor(value) || 0));
    setOptionSelections((prev) => ({ ...prev, [id]: clamped }));
  };

  return (
    <section id="calculator" className="scroll-mt-20 border-b border-border bg-secondary/30 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Калькулятор стоимости
          </h2>
          <p className="mt-3 text-muted-foreground">
            Выберите услугу и дополнительные опции — диапазон обновится мгновенно.
          </p>
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Параметры проекта</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="calculator-service">Услуга</Label>
              <Select value={serviceSlug} onValueChange={setServiceSlug}>
                <SelectTrigger id="calculator-service">
                  <SelectValue placeholder="Выберите услугу" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service.slug} value={service.slug}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium text-foreground">Дополнительные опции</span>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {OPTIONS.filter((option) => option.kind !== "per_unit").map((option) => (
                  <label
                    key={option.id}
                    htmlFor={`option-${option.id}`}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm shadow-sm"
                  >
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={Boolean(optionSelections[option.id])}
                      onCheckedChange={(checked) => setFlag(option.id, checked === true)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {OPTIONS.filter((option) => option.kind === "per_unit").map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm shadow-sm"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.unitLabel}, до {option.max}
                      </span>
                    </div>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={option.min ?? 0}
                      max={option.max}
                      value={Number(optionSelections[option.id] ?? 0)}
                      onChange={(event) =>
                        setQuantity(option.id, Number(event.target.value), option.min ?? 0, option.max)
                      }
                      className="w-20 text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {estimate && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
                <p className="text-sm text-muted-foreground">Предварительная стоимость:</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {formatPriceRange(estimate.min, estimate.max)}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Окончательная стоимость определяется после уточнения требований, интеграций и
              критериев приёмки.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#lead-form">
                Оставить заявку
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
