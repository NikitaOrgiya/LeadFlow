"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logServerError } from "@/lib/utils/errors";
import { isLeadStatus } from "@/lib/utils/lead-status";

export type UpdateLeadStatusResult = { success: true } | { success: false; error: string };

/**
 * Обновляет статус заявки. Доступ проверяется дважды: на уровне страницы
 * (requireAdmin) и на уровне базы данных (RLS-политика leads_admin_update
 * допускает UPDATE только для is_admin(auth.uid())).
 */
export async function updateLeadStatus(
  leadId: string,
  status: string
): Promise<UpdateLeadStatusResult> {
  await requireAdmin();

  if (!isLeadStatus(status)) {
    return { success: false, error: "Некорректный статус." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);

  if (error) {
    logServerError("actions/updateLeadStatus", error.message);
    return { success: false, error: "Не удалось обновить статус. Попробуйте ещё раз." };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  return { success: true };
}
