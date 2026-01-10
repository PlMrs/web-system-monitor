import { TcomputeDiskInfos } from "../types/stats.types";

export const computeDiskInfos: TcomputeDiskInfos = (fsSize, index) => ({
  sizeGB: parseFloat((fsSize[index].size / (1024 * 1024 * 1024)).toFixed(2)),
  usedGB: parseFloat((fsSize[index].used / (1024 * 1024 * 1024)).toFixed(2)),
  percent: parseFloat(fsSize[index].use.toFixed(1)),
});

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const computeState = (stateChar: string) => {
  const state = stateChar.charAt(0);
  switch (state) {
    case "R":
      return "running";
    case "S":
      return "sleeping";
    case "D":
      return "waiting";
    case "Z":
      return "zombie";
    case "T":
    case "t":
      return "stopped";
    case "W":
      return "paging";
    default:
      return "unknown";
  }
};
