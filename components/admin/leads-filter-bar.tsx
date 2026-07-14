"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/lib/utils/lead-status";
import { SERVICES } from "@/lib/pricing/pricing-config";

type LeadsFilterBarProps = {
  defaultQuery: string;
  defaultStatus: string;
  defaultService: string;
};

/** "all" помечает отсутствие фильтра — сервер трактует его как "без фильтра". */
export const FILTER_ALL_VALUE = "all";

export function LeadsFilterBar({ defaultQuery, defaultStatus, defaultService }: LeadsFilterBarProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      method="GET"
      action="/admin/leads"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex flex-1 flex-col gap-1.5 sm:min-w-[220px]">
        <label htmlFor="leads-search" className="text-sm font-medium text-foreground">
          Поиск
        </label>
        <Input
          id="leads-search"
          name="q"
          placeholder="Номер, имя, телефон или компания"
          defaultValue={defaultQuery}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <label className="text-sm font-medium text-foreground">Статус</label>
        <Select
          name="status"
          defaultValue={defaultStatus || FILTER_ALL_VALUE}
          onValueChange={() => formRef.current?.requestSubmit()}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL_VALUE}>Все статусы</SelectItem>
            {LEAD_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-56">
        <label className="text-sm font-medium text-foreground">Услуга</label>
        <Select
          name="service"
          defaultValue={defaultService || FILTER_ALL_VALUE}
          onValueChange={() => formRef.current?.requestSubmit()}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL_VALUE}>Все услуги</SelectItem>
            {SERVICES.map((service) => (
              <SelectItem key={service.slug} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Найти</Button>
    </form>
  );
}
