import { Chip } from "@mui/material";
import type React from "react";
import { useRecordContext } from "react-admin";

interface StatusFieldProps {
  source?: string;
}

export const StatusField: React.FC<StatusFieldProps> = ({
  source = "status",
}) => {
  const record = useRecordContext();

  if (!record) return null;

  const status = record[source];

  if (!status) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "success";
      case "form_completed":
        return "primary";
      case "matched":
        return "secondary";
      case "confirmed":
        return "success";
      case "verification_pending":
        return "warning";
      case "unverified":
        return "error";
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Chip
      label={formatStatus(status)}
      color={getStatusColor(status)}
      size="small"
    />
  );
};
