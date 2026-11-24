import { mockContainers } from "../mock";

export type InstanceType = "ct" | "vm";

export interface SelectOption {
  value: string;
  label: string;
}

export interface PveNodeOption extends SelectOption {
  cpuCores: number;
  memoryGiB: number;
}

export interface CreateForm {
  node: string;
  name: string;
  cpuCores: string;
  memoryMiB: string;
  storage: string;
  diskGiB: string;
  bridge: string;
  startAfterCreate: boolean;
  // CT 전용
  template: string;
  rootPassword: string;
  swapMiB: string;
  // VM 전용
  iso: string;
  guestOs: string;
  cpuType: string;
}

export const nodeOptions: PveNodeOption[] = [
  { value: "pve-node-1", label: "pve-node-1", cpuCores: 24, memoryGiB: 48 },
  { value: "pve-node-2", label: "pve-node-2", cpuCores: 16, memoryGiB: 32 },
  { value: "pve-node-3", label: "pve-node-3", cpuCores: 16, memoryGiB: 64 },
];

export const templateOptions: SelectOption[] = [
  { value: "ubuntu-22.04-standard", label: "Ubuntu 22.04" },
  { value: "debian-12-standard", label: "Debian 12" },
  { value: "alpine-3.19-default", label: "Alpine 3.19" },
  { value: "rockylinux-9-default", label: "Rocky Linux 9" },
];

export const isoOptions: SelectOption[] = [
  { value: "ubuntu-22.04.4-live-server-amd64.iso", label: "Ubuntu 22.04" },
  { value: "debian-12.5.0-amd64-netinst.iso", label: "Debian 12" },
  { value: "Rocky-9.3-x86_64-minimal.iso", label: "Rocky Linux 9" },
];

export const guestOsOptions: SelectOption[] = [
  { value: "l26", label: "Linux 6.x - 2.6 Kernel" },
  { value: "win11", label: "Windows 11/2022/2025" },
  { value: "other", label: "Other" },
];

export const cpuTypeOptions: SelectOption[] = [
  { value: "x86-64-v2-AES", label: "x86-64-v2-AES" },
  { value: "host", label: "host" },
  { value: "kvm64", label: "kvm64" },
];

export const storageOptions: SelectOption[] = [
  { value: "local-lvm", label: "local-lvm" },
  { value: "local-zfs", label: "local-zfs" },
];

export const bridgeOptions: SelectOption[] = [
  { value: "vmbr0", label: "vmbr0" },
  { value: "vmbr1", label: "vmbr1" },
];

export const initialForm: CreateForm = {
  node: nodeOptions[0].value,
  name: "",
  cpuCores: "",
  memoryMiB: "",
  storage: storageOptions[0].value,
  diskGiB: "",
  bridge: bridgeOptions[0].value,
  startAfterCreate: true,
  template: "",
  rootPassword: "",
  swapMiB: "",
  iso: "",
  guestOs: guestOsOptions[0].value,
  cpuType: cpuTypeOptions[0].value,
};

// API 연동 전이라 목업 목록의 마지막 ID 다음 번호를 보여준다
export const nextInstanceId =
  Math.max(...mockContainers.map((ct) => ct.id)) + 1;

export const findLabel = (options: SelectOption[], value: string) =>
  options.find((option) => option.value === value)?.label;

export const TYPE_COPY = {
  ct: {
    title: "컨테이너 (CT)",
    description: "LXC 기반 · 빠른 시작과 가벼운 리소스",
    badge: "LXC",
    idPrefix: "CT",
    nameLabel: "호스트 이름",
    namePlaceholder: "호스트 이름을 입력해주세요. (필수)",
    osTitle: "운영체제 및 인증",
    osHint: "CT에서 사용할 템플릿과 로그인 정보를 설정하세요.",
    diskLabel: "루트 디스크",
    startLabel: "생성 후 컨테이너 시작",
    noteTitle: "비특권 컨테이너로 생성됩니다.",
    noteDescription: "호스트와 격리된 권한으로 안전하게 실행합니다.",
    submitLabel: "CT 생성하기",
    defaults: [
      { label: "IPv4", value: "DHCP (자동 할당)" },
      { label: "VLAN", value: "태그 없음" },
      { label: "DNS", value: "호스트 설정 사용" },
    ],
  },
  vm: {
    title: "가상 머신 (VM)",
    description: "KVM 기반 · 독립된 OS와 커널",
    badge: "KVM",
    idPrefix: "VM",
    nameLabel: "VM 이름",
    namePlaceholder: "VM 이름을 입력해주세요. (필수)",
    osTitle: "운영체제",
    osHint: "설치할 ISO 이미지와 게스트 OS 종류를 선택하세요.",
    diskLabel: "디스크 용량",
    startLabel: "생성 후 VM 시작",
    noteTitle: "ISO 이미지로 부팅합니다.",
    noteDescription: "생성 후 Console에서 OS 설치를 진행하세요.",
    submitLabel: "VM 생성하기",
    defaults: [
      { label: "BIOS", value: "SeaBIOS" },
      { label: "머신 타입", value: "i440fx" },
      { label: "네트워크 모델", value: "VirtIO (반가상화)" },
    ],
  },
} as const;
