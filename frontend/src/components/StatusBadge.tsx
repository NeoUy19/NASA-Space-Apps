import type { Status } from "../types";
import { STATUS_LABELS } from "../theme";

// A small colored pill with the status in words ("Alert", "Normal", ...).
// The color comes from CSS, keyed on data-status.
export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="badge" data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  );
}
