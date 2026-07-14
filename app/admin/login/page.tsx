import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Вход в панель управления",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-5" />
          </span>
          <CardTitle className="mt-2">LeadFlow Admin</CardTitle>
          <CardDescription>Войдите, чтобы управлять заявками</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
