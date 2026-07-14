import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusSelect } from "@/components/admin/status-select";
import { formatDateTime } from "@/lib/utils/date";
import { formatPriceRange } from "@/lib/utils/currency";
import type { LeadRow } from "@/types/database";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export function LeadDetails({ lead }: { lead: LeadRow }) {
  const selectedOptions = Array.isArray(lead.selected_options) ? lead.selected_options : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {lead.public_number}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(lead.created_at)}</p>
        </div>
        <StatusSelect leadId={lead.id} status={lead.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Имя" value={lead.name} />
          <Field label="Телефон" value={lead.phone} />
          <Field label="Email" value={lead.email || "—"} />
          <Field label="Компания" value={lead.company || "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Проект</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Услуга" value={lead.service_name} />
            <Field
              label="Предварительная стоимость"
              value={
                lead.estimated_min !== null && lead.estimated_max !== null
                  ? formatPriceRange(lead.estimated_min, lead.estimated_max)
                  : "—"
              }
            />
            <Field label="Источник" value={lead.source} />
          </div>

          {selectedOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Дополнительные опции
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map((option) => (
                  <Badge key={String(option)} variant="secondary">
                    {String(option)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {lead.message && (
            <>
              <Separator />
              <Field label="Комментарий" value={<span className="whitespace-pre-wrap">{lead.message}</span>} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
