import { FC } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  history: any[];
};

export const CpuCharts: FC<Props> = ({ history }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase">
        Performance CPU
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "none" }}
            />
            <Area
              type="monotone"
              dataKey="cpuLoad"
              isAnimationActive={false}
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              name="Load %"
            />
            <Area
              type="monotone"
              dataKey="cpuTemp"
              isAnimationActive={false}
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.1}
              name="Temp °C"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
