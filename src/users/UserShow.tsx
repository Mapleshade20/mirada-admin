import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  ArrayField,
  ChipField,
  DateField,
  EditButton,
  EmailField,
  NumberField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TopToolbar,
} from "react-admin";

// import { adminActions } from "../dataProvider";

const UserShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

const ProfileImageField = ({
  record,
}: {
  record?: Record<string, unknown>;
}) => {
  if (!record?.form?.profile_photo_uri) return null;

  const imageUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8091"}${record.form.profile_photo_uri}`;

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
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

const CardImageField = ({ record }: { record?: Record<string, unknown> }) => {
  if (!record?.card_photo_uri) return null;

  const imageUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8091"}${record.card_photo_uri}`;

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <img
        src={imageUrl}
        alt="ID Card"
        style={{
          maxWidth: "300px",
          maxHeight: "200px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

const StatusChip = ({ record }: { record?: Record<string, unknown> }) => {
  if (!record) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
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
      default:
        return "default";
    }
  };

  return <ChipField source="status" color={getStatusColor(record.status)} />;
};

export const UserShow = () => (
  <Show actions={<UserShowActions />}>
    <SimpleShowLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <TextField source="id" />
              <EmailField source="email" />
              <StatusChip />
              <TextField source="grade" />
              <TextField source="wechat_id" />
              <DateField source="created_at" showTime />
              <DateField source="updated_at" showTime />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ID Verification
              </Typography>
              <CardImageField />
            </CardContent>
          </Card>
        </Grid>

        {/* Form Data Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField source="form.gender" label="Gender" />
                  <NumberField
                    source="form.physical_boundary"
                    label="Physical Boundary"
                  />
                  <TextField
                    source="form.self_intro"
                    label="Self Introduction"
                    multiline
                  />
                  <TextField
                    source="form.recent_topics"
                    label="Recent Topics"
                    multiline
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ProfileImageField />

                  <ArrayField source="form.familiar_tags" label="Familiar Tags">
                    <SingleFieldList>
                      <ChipField source="id" />
                    </SingleFieldList>
                  </ArrayField>

                  <ArrayField
                    source="form.aspirational_tags"
                    label="Aspirational Tags"
                  >
                    <SingleFieldList>
                      <ChipField source="id" />
                    </SingleFieldList>
                  </ArrayField>

                  <ArrayField source="form.self_traits" label="Self Traits">
                    <SingleFieldList>
                      <ChipField source="id" />
                    </SingleFieldList>
                  </ArrayField>

                  <ArrayField source="form.ideal_traits" label="Ideal Traits">
                    <SingleFieldList>
                      <ChipField source="id" />
                    </SingleFieldList>
                  </ArrayField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
