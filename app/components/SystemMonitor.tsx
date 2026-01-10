"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TStatsData } from "../types/stats.types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SystemMonitor() {
  const [history, setHistory] = useState<any[]>([]);
  const { data, error, isLoading } = useSWR<TStatsData>("/api/stats", fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (data && !error) {
      const newPoint = {
        time: new Date().toLocaleTimeString().slice(0, 8),
        cpuLoad: data.cpu.currentLoad,
        cpuTemp: data.cpu.temp,
        ramPercent: data.mem.percent,
        netDown: data.network?.rx_sec || 0,
        netUp: data.network?.tx_sec || 0,
      };
      setHistory((prev) => [...prev, newPoint].slice(-30));
    }
  }, [data]);

  if (isLoading)
    return <div className="p-4 text-slate-400">Connexion au S9+...</div>;
  if (error || !data)
    return <div className="p-4 text-red-500">Erreur Serveur</div>;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          label="CPU Load"
          value={`${data.cpu.currentLoad}%`}
          sub={`Avg: ${data.cpu.avgLoad}`}
          color="text-emerald-400"
        />
        <StatBlock
          label="RAM"
          value={`${data.mem.percent}%`}
          sub={`${data.mem.usedGB}/${data.mem.totalGB} GB`}
          color="text-blue-400"
        />
        <StatBlock
          label="SWAP"
          value={`${data.mem.swap.percent}%`}
          sub={`${data.mem.swap.usedGB}GB used on ${data.mem.swap.totalGB}GB`}
          color="text-cyan-400"
        />
        <StatBlock
          label="Temp"
          value={data.cpu.temp ? `${data.cpu.temp}°C` : "N/A"}
          sub="Core SoC"
          color="text-orange-400"
        />
        <StatBlock
          label="internal disk"
          value={data.disk ? `${data.disk.root.percent}%` : "N/A"}
          sub={
            data.disk
              ? `${data.disk.root.usedGB}GB used on ${data.disk.root.sizeGB}GB`
              : ""
          }
          color="text-purple-400"
        />
        <StatBlock
          label="external disk"
          value={data.disk ? `${data.disk.external.percent}%` : "N/A"}
          sub={
            data.disk
              ? `${data.disk.external.usedGB}GB used on ${data.disk.external.sizeGB}GB`
              : ""
          }
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  name="Load %"
                />
                <Area
                  type="monotone"
                  dataKey="cpuTemp"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  name="Temp °C"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Download"
                />
                <Line
                  type="stepAfter"
                  dataKey="netUp"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                  name="Upload"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, sub, color }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner">
      <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
      <p className={`text-2xl font-mono my-1 ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-400 font-mono">{sub}</p>
    </div>
  );
}
