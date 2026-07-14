import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { getPublicSupabaseAnonKey, getPublicSupabaseUrl } from "@/lib/utils/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getPublicSupabaseUrl(), getPublicSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Вызов setAll из серверного компонента без middleware — можно игнорировать,
          // если сессия обновляется в middleware.
        }
      },
    },
  });
}
