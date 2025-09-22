import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  ChipField,
  DateField,
  EditButton,
  EmailField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import { ImageField } from "../components/ImageField";

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

const MultilineTextDisplay = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Self Introduction
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {record?.form?.self_intro || "Not provided"}
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Recent Topics
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {record?.form?.recent_topics || "Not provided"}
        </Typography>
      </Box>
    </>
  );
};

const TagsDisplay = ({ source, label }: { source: string; label: string }) => {
  const record = useRecordContext();

  if (!record) return null;

  const getNestedValue = (obj: unknown, path: string): unknown => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const tags = getNestedValue(record, source) as
    | string[]
    | { name: string }[]
    | undefined;

  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          None selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {tags.map((tag) => {
          const tagValue =
            typeof tag === "string" ? tag : tag.name || String(tag);
          return (
            <ChipField
              key={tagValue}
              record={{ value: tagValue }}
              source="value"
            />
          );
        })}
      </Box>
    </Box>
  );
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User ID
                </Typography>
                <TextField source="id" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <EmailField source="email" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <TextField source="status" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Grade
                </Typography>
                <TextField source="grade" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  WeChat ID
                </Typography>
                <TextField source="wechat_id" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created At
                </Typography>
                <DateField source="created_at" showTime />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Updated At
                </Typography>
                <DateField source="updated_at" showTime />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Related Images
              </Typography>
              <ImageField
                source="card_photo_uri"
                label="ID Verification Card"
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

        {/* Form Data Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Gender
                    </Typography>
                    <TextField source="form.gender" />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Physical Boundary
                    </Typography>
                    <NumberField source="form.physical_boundary" />
                  </Box>
                  <MultilineTextDisplay />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ProfileImageField />

                  <TagsDisplay
                    source="form.familiar_tags"
                    label="Familiar Tags"
                  />
                  <TagsDisplay
                    source="form.aspirational_tags"
                    label="Aspirational Tags"
                  />
                  <TagsDisplay source="form.self_traits" label="Self Traits" />
                  <TagsDisplay
                    source="form.ideal_traits"
                    label="Ideal Traits"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
