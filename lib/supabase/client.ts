"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { getPublicSupabaseAnonKey, getPublicSupabaseUrl } from "@/lib/utils/env";

export function createClient() {
  return createBrowserClient<Database>(getPublicSupabaseUrl(), getPublicSupabaseAnonKey());
}
