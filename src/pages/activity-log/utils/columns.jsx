import { User, Clock, Link2 } from "lucide-react";
import { format } from "date-fns";

export const activityLogColumns = [
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.action}</span>
      </div>
    ),
  },
  {
    header: "User",
    accessorKey: "performed_by_name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>
          {row.performed_by_name || (
            <span className="italic text-muted-foreground">System</span>
          )}
        </span>
      </div>
    ),
  },
  {
    header: "Entity",
    accessorKey: "entity_type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <span className="capitalize">{row.entity_type || "-"}</span>
      </div>
    ),
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>
          {row.timestamp
            ? format(new Date(row.timestamp), "yyyy-MM-dd HH:mm:ss")
            : "-"}
        </span>
      </div>
    ),
  },
];
