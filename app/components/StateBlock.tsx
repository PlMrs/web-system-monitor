import { FC } from "react";

type Props = {
  label: string;
  value: string | number;
  sub?: string | number;
  color?: string;
};

export const StatBlock: FC<Props> = ({ label, value, sub, color }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner">
      <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
      <p className={`text-2xl font-mono my-1 ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-400 font-mono">{sub}</p>
    </div>
  );
};
