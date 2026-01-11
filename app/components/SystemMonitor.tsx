"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { TinitialHistoryPoints, TStatsData } from "../types/stats.types";
import { WifiCharts } from "./WifiCharts";
import { CpuCharts } from "./CpuCharts";
import { DiskUsage } from "./DiskUsage";
import { StatBlock } from "./StateBlock";
import { fetcher } from "../functions/functions";
import nextConfig from "@/next.config";

const initialHistory: TinitialHistoryPoints[] = Array.from(
  { length: 30 },
  (_, i) => ({
    time: i,
    cpuLoad: 0,
    cpuTemp: 0,
    netDown: 0,
    netUp: 0,
    diskRead: 0,
    diskWrite: 0,
  })
);

export const SystemMonitor = () => {
  const [history, setHistory] = useState<any[]>(initialHistory);
  const { data, error, isLoading } = useSWR<TStatsData>(`${nextConfig.basePath || ""}/api/stats`, fetcher, {
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
        diskRead: data.diskIO?.read_sec || 0,
        diskWrite: data.diskIO?.write_sec || 0,
      };
      setHistory((prev) => [...prev, newPoint].slice(-30));
    }
  }, [data]);

  if (isLoading) return <div className="p-4 text-slate-400">Chargement...</div>;
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
        <CpuCharts history={history} />
        <WifiCharts history={history} />
        <DiskUsage history={history} />
      </div>
    </div>
  );
};
