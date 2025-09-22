import { Cancel, CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  DateField,
  Edit,
  EmailField,
  SimpleForm,
  TextField,
  useNotify,
  useRecordContext,
  useRefresh,
  useUpdate,
} from "react-admin";
import { ImageField } from "../components/ImageField";

const QuickActionButtons = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [update] = useUpdate();

  if (!record) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await update("users", {
        id: record.id,
        data: { status: newStatus },
        previousData: record,
      });
      notify(`User status updated to ${newStatus}`, { type: "success" });
      refresh();
    } catch {
      notify("Error updating user status", { type: "error" });
    }
  };

  // Determine button states based on status
  const isUnverified = record.status === "unverified";

  const verifyDisabled =
    isUnverified || record.status !== "verification_pending";
  const rejectDisabled = isUnverified;

  return (
    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckCircle />}
        onClick={() => handleStatusUpdate("verified")}
        disabled={verifyDisabled}
      >
        Verify User
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<Cancel />}
        onClick={() => handleStatusUpdate("unverified")}
        disabled={rejectDisabled}
      >
        Reject User
      </Button>
    </Box>
  );
};

export const UserEdit = () => (
  <Edit>
    <SimpleForm toolbar={false}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User ID
                </Typography>
                <TextField source="id" disabled />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <EmailField source="email" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Grade
                </Typography>
                <TextField source="grade" disabled />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  WeChat ID
                </Typography>
                <TextField source="wechat_id" disabled />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created At
                </Typography>
                <DateField source="created_at" disabled showTime />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Updated At
                </Typography>
                <DateField source="updated_at" disabled showTime />
              </Box>

              <QuickActionButtons />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <ImageField
                source="card_photo_uri"
                label="ID Card Photo"
                maxWidth="100%"
                maxHeight="300px"
              />
              <ImageField
                source="form.profile_photo_uri"
                label="Profile Photo"
                maxWidth="100%"
                maxHeight="300px"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);
