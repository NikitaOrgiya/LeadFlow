import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { LeadsFilterBar, FILTER_ALL_VALUE } from "@/components/admin/leads-filter-bar";
import { LeadsTable } from "@/components/admin/leads-table";
import { Pagination } from "@/components/admin/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { isLeadStatus } from "@/lib/utils/lead-status";
import { logServerError } from "@/lib/utils/errors";

export const metadata: Metadata = {
  title: "Заявки",
};

const PAGE_SIZE = 10;

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    service?: string;
    page?: string;
  }>;
};

/** Убирает символы, ломающие синтаксис фильтра PostgREST .or(). */
function sanitizeSearchTerm(value: string): string {
  return value.replace(/[,()%]/g, "").trim().slice(0, 120);
}

function buildLeadsHref(params: {
  q: string;
  status: string;
  service: string;
  page: number;
}): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  if (params.service) query.set("service", params.service);
  if (params.page > 1) query.set("page", String(params.page));
  const qs = query.toString();
  return qs ? `/admin/leads?${qs}` : "/admin/leads";
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const session = await requireAdmin();
  const params = await searchParams;

  const q = (params.q ?? "").trim();
  const status = params.status && params.status !== FILTER_ALL_VALUE ? params.status : "";
  const service = params.service && params.service !== FILTER_ALL_VALUE ? params.service : "";
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createClient();
  let query = supabase.from("leads").select("*", { count: "exact" });

  const sanitizedQuery = sanitizeSearchTerm(q);
  if (sanitizedQuery) {
    query = query.or(
      `public_number.ilike.%${sanitizedQuery}%,name.ilike.%${sanitizedQuery}%,phone.ilike.%${sanitizedQuery}%,company.ilike.%${sanitizedQuery}%`
    );
  }

  if (status && isLeadStatus(status)) {
    query = query.eq("status", status);
  }

  if (service) {
    query = query.eq("service_name", service);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    logServerError("admin/leads:query_failed", error);
  }

  const hasFilters = Boolean(sanitizedQuery || status || service);

  return (
    <AdminShell email={session.email}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Заявки</h1>
          <p className="mt-1 text-sm text-muted-foreground">Поиск, фильтрация и просмотр заявок.</p>
        </div>

        <LeadsFilterBar defaultQuery={q} defaultStatus={status} defaultService={service} />

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>Не удалось загрузить данные. Попробуйте обновить страницу.</AlertDescription>
          </Alert>
        ) : (
          <>
            <LeadsTable leads={data ?? []} hasFilters={hasFilters} />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={count ?? 0}
              buildHref={(targetPage) => buildLeadsHref({ q: sanitizedQuery, status, service, page: targetPage })}
            />
          </>
        )}
      </div>
    </AdminShell>
  );
}
