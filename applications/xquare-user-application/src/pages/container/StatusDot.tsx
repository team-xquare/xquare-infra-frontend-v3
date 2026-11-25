import RunningDot from "../../assets/container/status-running.svg";
import StoppedDot from "../../assets/container/status-stopped.svg";
import type { PveStatus } from "./types";

function StatusDot({ status }: { status: PveStatus }) {
  return (
    <img
      src={status === "running" ? RunningDot : StoppedDot}
      alt=""
      width={8}
      height={8}
    />
  );
}

export default StatusDot;
