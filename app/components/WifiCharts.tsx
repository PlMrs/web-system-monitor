import { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  history: any[];
};

export const WifiCharts: FC<Props> = ({ history }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase">
        Débit Wi-Fi (KB/s)
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
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
            <Line
              type="stepAfter"
              dataKey="netDown"
              isAnimationActive={false}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Download"
            />
            <Line
              type="stepAfter"
              dataKey="netUp"
              isAnimationActive={false}
              stroke="#ec4899"
              strokeWidth={2}
              dot={false}
              name="Upload"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
