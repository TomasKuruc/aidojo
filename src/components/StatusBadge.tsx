import type { AccountStatus } from "../domain/types";

type StatusBadgeProps = {
  status: AccountStatus;
};

const STATUS_LABELS: Record<AccountStatus, string> = {
  OK: "Valid",
  ERR: "Checksum Error",
  ILL: "Illegible",
  AMB: "Ambiguous",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
