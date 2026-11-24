export const formatNumber = (value: number) => value.toLocaleString("en-US");

export const formatMiB = (mib: number) =>
  mib >= 1024 && mib % 1024 === 0
    ? `${formatNumber(mib / 1024)} GiB`
    : `${formatNumber(mib)} MiB`;

export const toPercent = (used: number, total: number) =>
  total > 0 ? Math.round((used / total) * 100) : 0;
