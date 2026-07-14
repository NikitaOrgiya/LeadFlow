import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { getPublicSupabaseUrl, getSupabaseServiceRoleKey } from "@/lib/utils/env";

/**
 * Клиент с service-role ключом. Обходит RLS — используется только в серверном
 * коде (route handlers), никогда не импортируется в клиентские компоненты.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(getPublicSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
