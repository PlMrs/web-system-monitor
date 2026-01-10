import { TcomputeDiskInfos } from "../types/stats.types";

export const computeDiskInfos: TcomputeDiskInfos = (fsSize, index) => ({
  sizeGB: parseFloat((fsSize[index].size / (1024 * 1024 * 1024)).toFixed(2)),
  usedGB: parseFloat((fsSize[index].used / (1024 * 1024 * 1024)).toFixed(2)),
  percent: parseFloat(fsSize[index].use.toFixed(1)),
});
