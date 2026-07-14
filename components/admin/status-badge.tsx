import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_BADGE_VARIANT, LEAD_STATUS_LABELS } from "@/lib/utils/lead-status";
import type { LeadStatus } from "@/types/database";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={LEAD_STATUS_BADGE_VARIANT[status]}>{LEAD_STATUS_LABELS[status]}</Badge>;
}
