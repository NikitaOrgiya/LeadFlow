import type { LeadStatus } from "@/types/database";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "rejected",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  contacted: "Связались",
  in_progress: "В работе",
  completed: "Завершена",
  rejected: "Отклонена",
};

export const LEAD_STATUS_BADGE_VARIANT: Record<
  LeadStatus,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  new: "default",
  contacted: "secondary",
  in_progress: "warning",
  completed: "success",
  rejected: "destructive",
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as string[]).includes(value);
}
