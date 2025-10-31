import {
  Datagrid,
  EmailField,
  ExportButton,
  Filter,
  List,
  SelectInput,
  TextField,
  TopToolbar,
} from "react-admin";
import { StatusField } from "../components";

const statusChoices = [
  { id: "unverified", name: "Unverified" },
  { id: "verification_pending", name: "Verification Pending" },
  { id: "verified", name: "Verified" },
  { id: "form_completed", name: "Form Completed" },
  { id: "matched", name: "Matched" },
  { id: "confirmed", name: "Confirmed" },
];

const genderChoices = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

const UserFilter = (props: Record<string, unknown>) => (
  <Filter {...props}>
    <SelectInput
      label="Status"
      source="status"
      choices={statusChoices}
      emptyText="All statuses"
      alwaysOn
    />
    <SelectInput
      label="Gender"
      source="gender"
      choices={genderChoices}
      emptyText="All genders"
      alwaysOn
    />
  </Filter>
);

const UserListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

export const UserList = () => (
  <List
    filters={<UserFilter />}
    sort={{ field: "created_at", order: "DESC" }}
    perPage={25}
    actions={<UserListActions />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" />
      <EmailField source="email" />
      <StatusField source="status" />
      <TextField source="wechat_id" />
    </Datagrid>
  </List>
);
