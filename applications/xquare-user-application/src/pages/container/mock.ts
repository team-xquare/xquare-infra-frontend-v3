import type { PveContainer, PveTask } from "./types";

// PVE API 연동 전까지 화면 구성에 쓰는 목업 데이터

// 최근 1시간, 1분 간격 (61개 지점)
const makeTrend = (base: number, amplitude: number, seed: number) =>
  Array.from({ length: 61 }, (_, i) => {
    const wave =
      Math.sin((i + seed) * 0.7) * 0.5 + Math.sin((i + seed) * 0.23) * 0.5;
    const spike = i % 17 === seed % 17 ? amplitude * 1.5 : 0;
    return Math.max(0, Math.min(100, base + wave * amplitude + spike));
  });

const stoppedTrend = Array.from({ length: 61 }, () => 0);

const defaultTasks: PveTask[] = [
  {
    time: "오늘 14:00:12",
    action: "Console 연결",
    user: "강은찬",
    result: "완료",
  },
  {
    time: "오늘 13:42:08",
    action: "리소스 조회",
    user: "강은찬",
    result: "완료",
  },
  {
    time: "10.24 09:58:00",
    action: "컨테이너 시작",
    user: "root@pam",
    result: "완료",
  },
];

export const mockContainers: PveContainer[] = [
  {
    id: 101,
    name: "xquare-infra-backend-v3",
    node: "pve-node-1",
    os: "ubuntu 22.04",
    status: "running",
    uptime: "12일 4시간",
    cpuCores: 2,
    memoryMiB: 2048,
    swapMiB: 512,
    usage: { cpuUsedCores: 0.24, memoryUsedMiB: 700, swapUsedMiB: 32 },
    network: {
      interface: "eth0 · vmbr0",
      ipv4: "10.0.0.101/24",
      gateway: "10.0.0.1",
      rootDiskUsedGiB: 8.6,
      rootDiskTotalGiB: 32,
      netInGiB: 1.2,
      netOutMiB: 840,
    },
    cpuTrend: makeTrend(10, 4, 1),
    memoryTrend: makeTrend(33, 1, 3),
    tasks: defaultTasks,
  },
  {
    id: 102,
    name: "xquare-infra-frontend-v3",
    node: "pve-node-1",
    os: "debian 12",
    status: "running",
    uptime: "8일 11시간",
    cpuCores: 1,
    memoryMiB: 1024,
    swapMiB: 512,
    usage: { cpuUsedCores: 0.08, memoryUsedMiB: 310, swapUsedMiB: 0 },
    network: {
      interface: "eth0 · vmbr0",
      ipv4: "10.0.0.102/24",
      gateway: "10.0.0.1",
      rootDiskUsedGiB: 3.1,
      rootDiskTotalGiB: 16,
      netInGiB: 0.4,
      netOutMiB: 512,
    },
    cpuTrend: makeTrend(7, 3, 5),
    memoryTrend: makeTrend(30, 2, 7),
    tasks: defaultTasks,
  },
  {
    id: 103,
    name: "xquare-mysql",
    node: "pve-node-2",
    os: "ubuntu 22.04",
    status: "running",
    uptime: "30일 2시간",
    cpuCores: 4,
    memoryMiB: 8192,
    swapMiB: 2048,
    usage: { cpuUsedCores: 1.12, memoryUsedMiB: 5120, swapUsedMiB: 128 },
    network: {
      interface: "eth0 · vmbr0",
      ipv4: "10.0.0.103/24",
      gateway: "10.0.0.1",
      rootDiskUsedGiB: 41.2,
      rootDiskTotalGiB: 64,
      netInGiB: 6.8,
      netOutMiB: 2310,
    },
    cpuTrend: makeTrend(28, 8, 9),
    memoryTrend: makeTrend(62, 2, 11),
    tasks: defaultTasks,
  },
  {
    id: 104,
    name: "xquare-redis",
    node: "pve-node-2",
    os: "alpine 3.19",
    status: "running",
    uptime: "30일 2시간",
    cpuCores: 1,
    memoryMiB: 512,
    swapMiB: 0,
    usage: { cpuUsedCores: 0.03, memoryUsedMiB: 96, swapUsedMiB: 0 },
    network: {
      interface: "eth0 · vmbr0",
      ipv4: "10.0.0.104/24",
      gateway: "10.0.0.1",
      rootDiskUsedGiB: 0.6,
      rootDiskTotalGiB: 8,
      netInGiB: 2.1,
      netOutMiB: 1980,
    },
    cpuTrend: makeTrend(3, 2, 13),
    memoryTrend: makeTrend(19, 1, 15),
    tasks: defaultTasks,
  },
  {
    id: 105,
    name: "dms-backend",
    node: "pve-node-3",
    os: "ubuntu 22.04",
    status: "stopped",
    uptime: "-",
    cpuCores: 2,
    memoryMiB: 2048,
    swapMiB: 512,
    usage: { cpuUsedCores: 0, memoryUsedMiB: 0, swapUsedMiB: 0 },
    network: {
      interface: "eth0 · vmbr0",
      ipv4: "10.0.0.105/24",
      gateway: "10.0.0.1",
      rootDiskUsedGiB: 12.4,
      rootDiskTotalGiB: 32,
      netInGiB: 0,
      netOutMiB: 0,
    },
    cpuTrend: stoppedTrend,
    memoryTrend: stoppedTrend,
    tasks: [
      {
        time: "10.20 18:12:44",
        action: "컨테이너 종료",
        user: "root@pam",
        result: "완료",
      },
    ],
  },
  {
    id: 106,
    name: "xquare-grafana",
    node: "pve-node-3",
    os: "debian 12",
    status: "running",
    uptime: "5일 19시간",
    cpuCores: 1,
    memoryMiB: 1024,
    swapMiB: 256,
    usage: { cpuUsedCores: 0.15, memoryUsedMiB: 420, swapUsedMiB: 12 },
    network: {
      interface: "eth0 · vmbr0",
      ipv4: "10.0.0.106/24",
      gateway: "10.0.0.1",
      rootDiskUsedGiB: 5.3,
      rootDiskTotalGiB: 16,
      netInGiB: 0.9,
      netOutMiB: 260,
    },
    cpuTrend: makeTrend(14, 5, 17),
    memoryTrend: makeTrend(41, 2, 19),
    tasks: defaultTasks,
  },
];
