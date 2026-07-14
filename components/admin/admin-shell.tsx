import Link from "next/link";
import { LayoutDashboard, ListChecks, Zap } from "lucide-react";

import { SignOutButton } from "@/components/admin/sign-out-button";

const NAV_LINKS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Заявки", icon: ListChecks },
];

export function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            <span>LeadFlow Admin</span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex" aria-label="Навигация панели управления">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {email && <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>}
            <SignOutButton />
          </div>
        </div>

        <nav
          className="flex items-center gap-4 border-t border-border px-4 py-2 sm:hidden"
          aria-label="Навигация панели управления (моб.)"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
