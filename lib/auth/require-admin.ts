import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

interface AdminSession {
  userId: string;
  email: string | null;
  profile: ProfileRow;
}

/**
 * Проверяет активную сессию Supabase Auth и роль администратора через таблицу
 * profiles. При отсутствии сессии или роли — редирект, а не просто скрытие UI,
 * так как страница не должна отрисовываться без подтверждённых прав.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }

  return { userId: user.id, email: user.email ?? null, profile };
}
