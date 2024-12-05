interface StatsCardProps {
  title: string;
  value: number;
  description: string;
}

export const StatsCard = ({ title, value, description }: StatsCardProps) => (
  <div className="rounded-lg border p-4 hover:shadow-md transition-shadow duration-200 bg-white">
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);