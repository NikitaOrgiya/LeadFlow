import { CalendarClock, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardCardsProps = {
  newCount: number;
  inProgressCount: number;
  completedCount: number;
  last7DaysCount: number;
};

export function DashboardCards({
  newCount,
  inProgressCount,
  completedCount,
  last7DaysCount,
}: DashboardCardsProps) {
  const items = [
    { label: "Новые заявки", value: newCount, icon: Sparkles },
    { label: "В работе", value: inProgressCount, icon: Loader2 },
    { label: "Завершённые", value: completedCount, icon: CheckCircle2 },
    { label: "За последние 7 дней", value: last7DaysCount, icon: CalendarClock },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
