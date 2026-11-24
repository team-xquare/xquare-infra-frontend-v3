export type PveStatus = "running" | "stopped";

export interface PveUsage {
  cpuUsedCores: number;
  memoryUsedMiB: number;
  swapUsedMiB: number;
}

export interface PveNetwork {
  interface: string;
  ipv4: string;
  gateway: string;
  rootDiskUsedGiB: number;
  rootDiskTotalGiB: number;
  netInGiB: number;
  netOutMiB: number;
}

export interface PveTask {
  time: string;
  action: string;
  user: string;
  result: string;
}

export interface PveContainer {
  id: number;
  name: string;
  node: string;
  os: string;
  status: PveStatus;
  uptime: string;
  cpuCores: number;
  memoryMiB: number;
  swapMiB: number;
  usage: PveUsage;
  network: PveNetwork;
  cpuTrend: number[];
  memoryTrend: number[];
  tasks: PveTask[];
}
