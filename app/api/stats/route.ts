// app/api/stats/route.ts
import { computeDiskInfos } from "@/app/functions/functions";
import { StatsFetch, TStatsData } from "@/app/types/stats.types";
import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    const [cpuLoad, mem, cpuTemp, fsSize, networkStats] = (await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.fsSize(),
      si.networkStats("wlan0"),
    ])) as StatsFetch;

    const data: TStatsData = {
      timestamp: Date.now(),
      cpu: {
        currentLoad: parseFloat(cpuLoad.currentLoad.toFixed(2)),
        avgLoad: parseFloat(cpuLoad.avgLoad.toFixed(2)),
        temp: cpuTemp.main ? parseFloat(cpuTemp.main.toFixed(1)) : null,
      },
      mem: {
        usedGB: parseFloat((mem.used / (1024 * 1024 * 1024)).toFixed(2)),
        totalGB: parseFloat((mem.total / (1024 * 1024 * 1024)).toFixed(2)),
        percent: parseFloat(((mem.used / mem.total) * 100).toFixed(1)),
        swap: {
          usedGB: parseFloat((mem.swapused / (1024 * 1024 * 1024)).toFixed(2)),
          totalGB: parseFloat(
            (mem.swaptotal / (1024 * 1024 * 1024)).toFixed(2)
          ),
          percent: parseFloat(
            ((mem.swapused / mem.swaptotal) * 100).toFixed(1)
          ),
          free: parseFloat((mem.swapfree / (1024 * 1024 * 1024)).toFixed(2)),
        },
      },
      disk:
        fsSize.length > 0
          ? {
              root: computeDiskInfos(fsSize, 0),
              external: computeDiskInfos(fsSize, 1),
            }
          : null,
      network:
        networkStats.length > 0
          ? {
              rx_sec: parseFloat((networkStats[0].rx_sec / 1024).toFixed(2)),
              tx_sec: parseFloat((networkStats[0].tx_sec / 1024).toFixed(2)),
            }
          : null,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques système:",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch system data" },
      { status: 500 }
    );
  }
}
