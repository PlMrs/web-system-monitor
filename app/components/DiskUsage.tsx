import { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  history: any[];
};

export const DiskUsage: FC<Props> = ({ history }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Activité Disque Globale
        </h2>
        <div className="flex gap-4 text-[10px] uppercase font-bold">
          <span className="text-amber-500">● Écriture</span>
          <span className="text-cyan-500">● Lecture</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorWrite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis dataKey="time" hide />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(value) => `${value} IO`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
              }}
              itemStyle={{ fontSize: "12px" }}
              labelStyle={{ display: "none" }}
            />
            <Area
              type="monotone"
              dataKey="diskRead"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#colorRead)"
              isAnimationActive={false}
              name="Lecture (IO/s)"
            />
            <Area
              type="monotone"
              dataKey="diskWrite"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorWrite)"
              isAnimationActive={false}
              name="Écriture (IO/s)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
