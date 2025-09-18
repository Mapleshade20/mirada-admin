// import { Card, CardContent, Typography, Box } from "@mui/material";
import { PlayArrow, Refresh } from "@mui/icons-material";
import {
  Button,
  Datagrid,
  EmailField,
  ExportButton,
  List,
  NumberField,
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

// const UserPairCard = ({ record }: { record?: Record<string, unknown> }) => {
//   if (!record) return null;

//   return (
//     <Card sx={{ mb: 2 }}>
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Match #{record.id?.slice(-8)}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Score: {record.score?.toFixed(2)}
//             </Typography>
//           </Box>
//           <Box textAlign="right">
//             <Typography variant="body2">
//               <strong>User A:</strong> {record.user_a_email}
//             </Typography>
//             <Typography variant="body2">
//               <strong>User B:</strong> {record.user_b_email}
//             </Typography>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

export const MatchList = () => (
  <List
    sort={{ field: "score", order: "DESC" }}
    perPage={25}
    actions={<MatchListActions />}
  >
    <Datagrid rowClick={false}>
      <TextField source="id" label="Match ID" />
      <EmailField source="user_a_email" label="User A" />
      <EmailField source="user_b_email" label="User B" />
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
