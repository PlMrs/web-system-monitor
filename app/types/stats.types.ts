import { NextRequest } from "next/server";
import { Systeminformation } from "systeminformation";

export type StatsFetch = {
  cpuLoad: Systeminformation.CurrentLoadData;
  mem: Systeminformation.MemData;
  cpuTemp: Systeminformation.CpuTemperatureData;
  fsSize: Systeminformation.FsSizeData[];
  disksIO: Systeminformation.DisksIoData;
  networkStats: Systeminformation.NetworkStatsData[];
};

export type TcomputeDiskInfos = (
  fsSize: StatsFetch["fsSize"],
  index: number
) => {
  sizeGB: number;
  usedGB: number;
  percent: number;
};

export type TStatsData = {
  timestamp: number;
  cpu: {
    currentLoad: number;
    avgLoad: number;
    temp: number | null;
  };
  mem: {
    usedGB: number;
    totalGB: number;
    percent: number;
    swap: {
      usedGB: number;
      totalGB: number;
      percent: number;
      free: number;
    };
  };
  disk: {
    root: ReturnType<TcomputeDiskInfos>;
    external: ReturnType<TcomputeDiskInfos>;
  } | null;
  diskIO: {
    read_sec: number;
    write_sec: number;
  };
  network: {
    rx_sec: number;
    tx_sec: number;
  } | null;
};

export type TinitialHistoryPoints = {
  time: number;
  cpuLoad: number;
  cpuTemp: number;
  netDown: number;
  netUp: number;
  diskRead: number;
  diskWrite: number;
};

export type TComputeCSSHeader = (
  headers: NextRequest["headers"]
) => Headers;
