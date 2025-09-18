import { Typography } from "@mui/material";
import type React from "react";
import { useRecordContext } from "react-admin";

interface DateTimeFieldProps {
  source: string;
  label?: string;
  showTime?: boolean;
  showDate?: boolean;
  format?: "short" | "medium" | "long" | "full";
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  source,
  label,
  showTime = true,
  showDate = true,
  format = "medium",
}) => {
  const record = useRecordContext();

  if (!record) return null;

  const getNestedValue = (obj: unknown, path: string): unknown => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const value = getNestedValue(record, source);

  if (!value) return null;

  let date: Date;

  // Handle different date formats
  if (Array.isArray(value)) {
    // Contigo timestamp format: [year, day_of_year, hour, minute, second, nanosecond, ...]
    const [year, dayOfYear, hour, minute, second, nanosecond] = value;
    date = new Date(
      year,
      0,
      dayOfYear,
      hour || 0,
      minute || 0,
      second || 0,
      Math.floor((nanosecond || 0) / 1000000),
    );
  } else if (typeof value === "string") {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else {
    return null;
  }

  if (Number.isNaN(date.getTime())) {
    return (
      <Typography variant="body2" color="error">
        Invalid date
      </Typography>
    );
  }

  const formatOptions: Intl.DateTimeFormatOptions = {};

  if (showDate) {
    formatOptions.dateStyle = format;
  }

  if (showTime) {
    formatOptions.timeStyle = format;
  }

  const formattedDate = date.toLocaleString(undefined, formatOptions);

  return (
    <Typography variant="body2">
      {label && `${label}: `}
      {formattedDate}
    </Typography>
  );
};
