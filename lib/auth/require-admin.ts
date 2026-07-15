import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { logServerError } from "@/lib/utils/errors";
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
 *
 * Роль администратора не хранится в коде и не подделывается — источник
 * истины всегда таблица profiles, прочитанная через обычный (не service-role)
 * клиент текущего пользователя, чтобы решение принималось той же RLS-
 * политикой, что защищает данные.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    logServerError("auth/requireAdmin:get_user_failed", userError);
  }

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    // Ошибка запроса профиля (например, недостаточно табличных прав у
    // authenticated) — это не то же самое, что "пользователь без роли admin",
    // и должна быть видна в серверном логе, а не молча трактоваться как отказ.
    logServerError("auth/requireAdmin:profile_lookup_failed", profileError);
  }

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }

  return { userId: user.id, email: user.email ?? null, profile };
}
