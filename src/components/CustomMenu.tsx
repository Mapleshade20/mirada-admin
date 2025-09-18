import {
  Analytics,
  Favorite,
  People,
  Schedule,
  Tag,
} from "@mui/icons-material";
import { Menu } from "react-admin";

export const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.Item to="/users" primaryText="Users" leftIcon={<People />} />
    <Menu.Item to="/matches" primaryText="Matches" leftIcon={<Favorite />} />
    <Menu.Item
      to="/scheduled-matches"
      primaryText="Scheduled Matches"
      leftIcon={<Schedule />}
    />
    <Menu.Item
      to="/analytics/dashboard"
      primaryText="Analytics"
      leftIcon={<Analytics />}
    />
    <Menu.Item
      to="/analytics/tags"
      primaryText="Tag Analytics"
      leftIcon={<Tag />}
    />
  </Menu>
);
