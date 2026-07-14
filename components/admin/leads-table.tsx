import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/utils/date";
import { formatPriceRange } from "@/lib/utils/currency";
import type { LeadRow } from "@/types/database";

export function LeadsTable({ leads, hasFilters }: { leads: LeadRow[]; hasFilters: boolean }) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-16 text-center">
        <p className="font-medium text-foreground">
          {hasFilters ? "По заданным условиям ничего не найдено" : "Заявок пока нет"}
        </p>
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? "Попробуйте изменить поиск или фильтры."
            : "Новые заявки с сайта появятся здесь."}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Номер</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Имя</TableHead>
          <TableHead>Компания</TableHead>
          <TableHead>Услуга</TableHead>
          <TableHead>Телефон</TableHead>
          <TableHead>Оценка</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Действие</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.public_number}</TableCell>
            <TableCell>{formatDateTime(lead.created_at)}</TableCell>
            <TableCell>{lead.name}</TableCell>
            <TableCell>{lead.company || "—"}</TableCell>
            <TableCell>{lead.service_name}</TableCell>
            <TableCell>{lead.phone}</TableCell>
            <TableCell>
              {lead.estimated_min !== null && lead.estimated_max !== null
                ? formatPriceRange(lead.estimated_min, lead.estimated_max)
                : "—"}
            </TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/admin/leads/${lead.id}`} className="text-sm font-medium text-primary hover:underline">
                Открыть
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
