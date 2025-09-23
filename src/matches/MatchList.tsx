// import { Card, CardContent, Typography, Box } from "@mui/material";
import { PlayArrow, Refresh } from "@mui/icons-material";
import {
  Button,
  Datagrid,
  EmailField,
  ExportButton,
  List,
  NumberField,
  ReferenceField,
  TextField,
  TopToolbar,
  useNotify,
  useRefresh,
} from "react-admin";
import { adminActions } from "../dataProvider";

const MatchListActions = () => {
  const notify = useNotify();
  const refresh = useRefresh();

  const handleUpdatePreviews = async () => {
    try {
      const result = await adminActions.updatePreviews();
      notify(result.message || "Match previews updated successfully", {
        type: "success",
      });
      refresh();
    } catch {
      notify("Failed to update match previews", { type: "error" });
    }
  };

  const handleTriggerMatch = async () => {
    try {
      const result = await adminActions.triggerMatch();
      notify(`${result.message}. Matches created: ${result.matches_created}`, {
        type: "success",
      });
      refresh();
    } catch {
      notify("Failed to trigger matching", { type: "error" });
    }
  };

  return (
    <TopToolbar>
      <Button
        onClick={handleUpdatePreviews}
        label="Update Previews"
        startIcon={<Refresh />}
      />
      <Button
        onClick={handleTriggerMatch}
        label="Trigger Match"
        startIcon={<PlayArrow />}
        variant="contained"
        color="primary"
      />
      <ExportButton />
    </TopToolbar>
  );
};

export const MatchList = () => (
  <List
    sort={{ field: "score", order: "DESC" }}
    perPage={25}
    actions={<MatchListActions />}
  >
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField source="id" label="Match ID" />
      <ReferenceField
        source="user_a_id"
        reference="users"
        link="show"
        label="User A"
      >
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField
        source="user_b_id"
        reference="users"
        link="show"
        label="User B"
      >
        <TextField source="email" />
      </ReferenceField>
      <NumberField
        source="score"
        label="Match Score"
        options={{
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }}
      />
    </Datagrid>
  </List>
);
