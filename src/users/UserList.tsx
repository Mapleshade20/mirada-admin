import { Chip } from "@mui/material";
import {
  BulkDeleteButton,
  BulkUpdateButton,
  Datagrid,
  DateField,
  EmailField,
  ExportButton,
  Filter,
  List,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";

const statusChoices = [
  { id: "unverified", name: "Unverified" },
  { id: "verification_pending", name: "Verification Pending" },
  { id: "verified", name: "Verified" },
  { id: "form_completed", name: "Form Completed" },
  { id: "matched", name: "Matched" },
  { id: "confirmed", name: "Confirmed" },
];

const UserFilter = (props: Record<string, unknown>) => (
  <Filter {...props}>
    <TextInput label="Search by email" source="email" alwaysOn />
    <SelectInput
      label="Status"
      source="status"
      choices={statusChoices}
      emptyText="All statuses"
    />
  </Filter>
);

const StatusField = ({ record }: { record?: Record<string, unknown> }) => {
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

  return (
    <Chip
      label={record.status?.replace("_", " ")}
      color={getStatusColor(record.status)}
      size="small"
    />
  );
};

const UserListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

const UserBulkActionButtons = () => (
  <>
    <BulkUpdateButton
      label="Verify Selected"
      data={{ status: "verified" }}
      mutationMode="pessimistic"
    />
    <BulkDeleteButton />
  </>
);

export const UserList = () => (
  <List
    filters={<UserFilter />}
    sort={{ field: "created_at", order: "DESC" }}
    perPage={25}
    actions={<UserListActions />}
  >
    <Datagrid rowClick="show" bulkActionButtons={<UserBulkActionButtons />}>
      <TextField source="id" />
      <EmailField source="email" />
      <StatusField source="status" />
      <TextField source="grade" />
      <TextField source="wechat_id" />
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
    </Datagrid>
  </List>
);
