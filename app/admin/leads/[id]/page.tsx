import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { LeadDetails } from "@/components/admin/lead-details";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Карточка заявки",
};

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: LeadDetailPageProps) {
  const session = await requireAdmin();
  const { id } = await params;

  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();

  return (
    <AdminShell email={session.email}>
      {lead ? (
        <LeadDetails lead={lead} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium text-foreground">Заявка не найдена</p>
          <p className="text-sm text-muted-foreground">
            Возможно, она была удалена или у вас неверная ссылка.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/admin/leads">К списку заявок</Link>
          </Button>
        </div>
      )}
    </AdminShell>
  );
}
