
import { cn } from "@/lib/utils";

interface TileCounterProps {
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

export function TileCounter({ title, count, color, icon, ...props }: TileCounterProps) {
  return (
    <div className={cn(
      "flex items-center p-4 rounded-lg shadow-sm",
      color
    )} {...props}>
      <div className="mr-4 bg-white bg-opacity-30 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-white text-opacity-90 text-sm font-medium">{title}</p>
        <h4 className="text-white text-2xl font-bold">{count}</h4>
      </div>
    </div>
  );
}
