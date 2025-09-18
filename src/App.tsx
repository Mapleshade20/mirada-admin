import { Favorite, People, Schedule } from "@mui/icons-material";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import { Dashboard, TagsAnalytics } from "./analytics";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";
import { Layout } from "./Layout";
import { MatchList, ScheduledMatchCreate, ScheduledMatchList } from "./matches";
import { UserEdit, UserList, UserShow } from "./users";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    layout={Layout}
    dashboard={Dashboard}
  >
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
      edit={UserEdit}
      icon={People}
    />
    <Resource name="matches" list={MatchList} icon={Favorite} />
    <Resource
      name="scheduled-matches"
      list={ScheduledMatchList}
      create={ScheduledMatchCreate}
      icon={Schedule}
    />
    <CustomRoutes>
      <Route path="/analytics/dashboard" element={<Dashboard />} />
      <Route path="/analytics/tags" element={<TagsAnalytics />} />
    </CustomRoutes>
  </Admin>
);
