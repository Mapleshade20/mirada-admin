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
        validate={[required()]}
        fullWidth
      />
    </SimpleForm>
  </Create>
);
