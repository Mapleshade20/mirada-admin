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
  SaveButton,
  SelectInput,
  SimpleForm,
  TextField,
  Toolbar,
  useNotify,
  useRecordContext,
  useRefresh,
  useUpdate,
} from "react-admin";

const statusChoices = [
  { id: "unverified", name: "Unverified" },
  { id: "verification_pending", name: "Verification Pending" },
  { id: "verified", name: "Verified" },
  { id: "form_completed", name: "Form Completed" },
  { id: "matched", name: "Matched" },
  { id: "confirmed", name: "Confirmed" },
];

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

  return (
    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckCircle />}
        onClick={() => handleStatusUpdate("verified")}
        disabled={record.status === "verified"}
      >
        Verify User
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<Cancel />}
        onClick={() => handleStatusUpdate("unverified")}
        disabled={record.status === "unverified"}
      >
        Reject User
      </Button>
    </Box>
  );
};

const UserEditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

const CardImageDisplay = ({ record }: { record?: Record<string, unknown> }) => {
  if (!record?.card_photo_uri) return null;

  const imageUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8091"}${record.card_photo_uri}`;

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        ID Card Photo
      </Typography>
      <img
        src={imageUrl}
        alt="ID Card"
        style={{
          maxWidth: "100%",
          maxHeight: "300px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

const ProfileImageDisplay = ({
  record,
}: {
  record?: Record<string, unknown>;
}) => {
  if (!record?.form?.profile_photo_uri) return null;

  const imageUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8091"}${record.form.profile_photo_uri}`;

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Profile Photo
      </Typography>
      <img
        src={imageUrl}
        alt="Profile"
        style={{
          maxWidth: "200px",
          maxHeight: "200px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export const UserEdit = () => (
  <Edit>
    <SimpleForm toolbar={<UserEditToolbar />}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>

              <TextField source="id" disabled />
              <EmailField source="email" />
              <SelectInput source="status" choices={statusChoices} fullWidth />
              <TextField source="grade" disabled />
              <TextField source="wechat_id" disabled />
              <DateField source="created_at" disabled showTime />
              <DateField source="updated_at" disabled showTime />

              <QuickActionButtons />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <CardImageDisplay />
              <ProfileImageDisplay />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);
