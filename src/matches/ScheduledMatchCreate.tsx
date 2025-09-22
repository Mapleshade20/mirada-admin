import { Card, CardContent, Typography } from "@mui/material";
import {
  Create,
  DateTimeInput,
  required,
  SaveButton,
  SimpleForm,
  Toolbar,
} from "react-admin";

const ScheduledMatchCreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

// Parse function to convert user's local datetime to UTC ISO string with seconds
const parseScheduledTime = (value: string | Date | null): string | null => {
  if (!value) return null;

  // If value is already a Date object, convert to ISO string
  if (value instanceof Date) {
    return value.toISOString();
  }

  // If value is a string, parse it as local time and convert to UTC
  if (typeof value === "string") {
    // Add seconds if not present (React Admin's DateTimeInput omits seconds)
    const dateTimeWithSeconds =
      value.includes(":") && value.split(":").length === 2
        ? `${value}:00`
        : value;

    // Create Date object treating input as local time, then convert to UTC
    const localDate = new Date(dateTimeWithSeconds);
    return localDate.toISOString();
  }

  return null;
};

export const ScheduledMatchCreate = () => (
  <Create>
    <SimpleForm toolbar={<ScheduledMatchCreateToolbar />}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Schedule New Matching Run
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Schedule a time for the automatic matching algorithm to run. This
            will create matches between eligible users based on their
            preferences and compatibility.
          </Typography>
        </CardContent>
      </Card>

      <DateTimeInput
        source="scheduled_time"
        label="Scheduled Time"
        parse={parseScheduledTime}
        validate={[required()]}
        fullWidth
      />
    </SimpleForm>
  </Create>
);
