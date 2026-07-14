"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLandingState } from "@/components/landing/landing-state";
import { leadFormSchema, type LeadFormValues } from "@/lib/validation/lead";
import { SERVICES } from "@/lib/pricing/pricing-config";
import { formatPriceRange } from "@/lib/utils/currency";

export function LeadForm() {
  const router = useRouter();
  const { serviceSlug, setServiceSlug, optionSelections, estimate } = useLandingState();
  const [formRenderedAt] = useState(() => Date.now());
  const [isSubmittingGuard, setIsSubmittingGuard] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      message: "",
      serviceSlug,
      consent: undefined as unknown as true,
    },
  });

  useEffect(() => {
    form.setValue("serviceSlug", serviceSlug, { shouldValidate: false });
  }, [serviceSlug, form]);

  const consentValue = useWatch({ control: form.control, name: "consent" });

  const onSubmit = form.handleSubmit(async (values) => {
    if (isSubmittingGuard) return;
    setIsSubmittingGuard(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          optionSelections,
          honeypot,
          formRenderedAt,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        toast.error(result?.error ?? "Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.");
        return;
      }

      form.reset();
      setHoneypot("");

      const params = new URLSearchParams({
        number: result.leadNumber,
        service: SERVICES.find((s) => s.slug === serviceSlug)?.name ?? "",
        min: String(result.estimatedMin),
        max: String(result.estimatedMax),
      });
      router.push(`/success?${params.toString()}`);
    } catch {
      toast.error("Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setIsSubmittingGuard(false);
    }
  });

  return (
    <section id="lead-form" className="scroll-mt-20 border-b border-border py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Обсудить проект
          </h2>
          <p className="mt-3 text-muted-foreground">
            Оставьте контакты — мы изучим задачу и свяжемся с вами для уточнения деталей.
          </p>
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Заявка на проект</CardTitle>
            {estimate && (
              <CardDescription>
                Предварительная стоимость: {formatPriceRange(estimate.min, estimate.max)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              {/* Honeypot: скрытое поле-ловушка для ботов, не должно быть видно человеку */}
              <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Не заполняйте это поле</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lead-name">Имя *</Label>
                <Input id="lead-name" autoComplete="name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lead-phone">Телефон *</Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+7 900 000-00-00"
                  {...form.register("phone")}
                  aria-invalid={!!form.formState.errors.phone}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lead-email">Email</Label>
                <Input id="lead-email" type="email" autoComplete="email" {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lead-company">Компания</Label>
                <Input id="lead-company" autoComplete="organization" {...form.register("company")} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lead-service">Услуга *</Label>
                <Select
                  value={serviceSlug}
                  onValueChange={(value) => {
                    setServiceSlug(value);
                    form.setValue("serviceSlug", value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger id="lead-service">
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

              {estimate && estimate.selectedOptionLabels.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label>Выбранные опции</Label>
                  <div className="flex flex-wrap gap-2">
                    {estimate.selectedOptionLabels.map((label) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="lead-message">Комментарий</Label>
                <Textarea id="lead-message" rows={4} {...form.register("message")} />
                {form.formState.errors.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                )}
              </div>

              <label htmlFor="lead-consent" className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  id="lead-consent"
                  checked={consentValue === true}
                  onCheckedChange={(checked) =>
                    form.setValue("consent", checked === true ? true : (undefined as unknown as true), {
                      shouldValidate: true,
                    })
                  }
                />
                <span>
                  Я согласен на{" "}
                  <a href="/consent" target="_blank" className="underline">
                    обработку персональных данных
                  </a>
                  *
                </span>
              </label>
              {form.formState.errors.consent && (
                <p className="-mt-3 text-sm text-destructive">{form.formState.errors.consent.message}</p>
              )}

              <Button type="submit" size="lg" disabled={form.formState.isSubmitting || isSubmittingGuard}>
                {form.formState.isSubmitting || isSubmittingGuard ? "Отправляем…" : "Отправить заявку"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
