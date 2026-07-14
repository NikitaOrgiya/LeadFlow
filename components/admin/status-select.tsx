"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLeadStatus } from "@/lib/actions/leads";
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/lib/utils/lead-status";
import type { LeadStatus } from "@/types/database";

export function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    const previous = currentStatus;
    setCurrentStatus(value as LeadStatus);

    startTransition(async () => {
      const result = await updateLeadStatus(leadId, value);
      if (result.success) {
        toast.success("Статус заявки обновлён");
      } else {
        setCurrentStatus(previous);
        toast.error(result.error);
      }
    });
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LEAD_STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            {LEAD_STATUS_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
