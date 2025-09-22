import { Chip } from "@mui/material";
import {
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  FunctionField,
  List,
  NumberField,
  TextField,
  TopToolbar,
} from "react-admin";
import { StatusField } from "../components";

const ScheduledMatchListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const CustomDeleteButton = ({
  record,
}: {
  record?: Record<string, unknown>;
}) => {
  // const _notify = useNotify();
  // const _refresh = useRefresh();

  if (!record || record.status === "Completed") {
    return null;
  }

  return (
    <DeleteButton
      record={record}
      resource="scheduled-matches"
      mutationMode="pessimistic"
      confirmTitle="Cancel Scheduled Match"
      confirmContent="Are you sure you want to cancel this scheduled match?"
    />
  );
};

export const ScheduledMatchList = () => (
  <List
    sort={{ field: "scheduled_time", order: "ASC" }}
    perPage={25}
    actions={<ScheduledMatchListActions />}
  >
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField source="id" label="Schedule ID" />
      <DateField source="scheduled_time" label="Scheduled Time" showTime />
      <StatusField source="status" label="Status" />
      <DateField source="created_at" label="Created At" showTime />
      <DateField source="executed_at" label="Executed At" showTime />
      <NumberField
        source="matches_created"
        label="Matches Created"
        emptyText="N/A"
      />
      <FunctionField
        source="error_message"
        label="Error"
        sortBy="error_message"
        render={(record: Record<string, unknown>) =>
          record.error_message ? (
            <Chip label="Error" color="error" size="small" />
          ) : null
        }
      />
      <FunctionField
        label="Actions"
        sortable={false}
        render={(record: Record<string, unknown>) => (
          <CustomDeleteButton record={record} />
        )}
      />
    </Datagrid>
  </List>
);
