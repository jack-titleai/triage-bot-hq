
import { useState, useEffect } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: ChartData[];
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallScreen = windowSize.width < 768;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={isSmallScreen ? 200 : 300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={isSmallScreen ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} messages`, 'Count']} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
