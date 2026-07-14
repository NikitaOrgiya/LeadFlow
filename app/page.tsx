import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>LeadFlow</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Каркас проекта настроен. Публичный интерфейс будет добавлен на следующем этапе.
          </p>
          <Button>Рассчитать стоимость</Button>
        </CardContent>
      </Card>
    </main>
  );
}
