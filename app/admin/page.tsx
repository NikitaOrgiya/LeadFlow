import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardCards } from "@/components/admin/dashboard-cards";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { logServerError } from "@/lib/utils/errors";
import { getIsoDaysAgo } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Дашборд",
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const supabase = await createClient();

  const sevenDaysAgo = getIsoDaysAgo(7);

  const [newResult, inProgressResult, completedResult, last7DaysResult] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
  ]);

  for (const result of [newResult, inProgressResult, completedResult, last7DaysResult]) {
    if (result.error) {
      logServerError("admin/dashboard", result.error.message);
    }
  }

  return (
    <AdminShell email={session.email}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Дашборд</h1>
          <p className="mt-1 text-sm text-muted-foreground">Сводка по заявкам LeadFlow.</p>
        </div>

        <DashboardCards
          newCount={newResult.count ?? 0}
          inProgressCount={inProgressResult.count ?? 0}
          completedCount={completedResult.count ?? 0}
          last7DaysCount={last7DaysResult.count ?? 0}
        />
      </div>
    </AdminShell>
  );
}
