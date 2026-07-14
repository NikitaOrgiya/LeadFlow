import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
};

export function Pagination({ page, pageSize, total, buildHref }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-sm text-muted-foreground">
        Страница {page} из {totalPages} · всего заявок: {total}
      </p>
      <div className="flex gap-2">
        {page <= 1 ? (
          <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
            <ChevronLeft className="size-4" />
            Назад
          </span>
        ) : (
          <Link href={buildHref(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ChevronLeft className="size-4" />
            Назад
          </Link>
        )}
        {page >= totalPages ? (
          <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
            Далее
            <ChevronRight className="size-4" />
          </span>
        ) : (
          <Link href={buildHref(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Далее
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
