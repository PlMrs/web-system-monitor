import { Systeminformation } from "systeminformation"

export type StatsFetch = [
    cpuLoad: Systeminformation.CurrentLoadData,
    mem: Systeminformation.MemData,
    cpuTemp: Systeminformation.CpuTemperatureData,
    fsSize: Systeminformation.FsSizeData[],
    networkStats: Systeminformation.NetworkStatsData[]
]