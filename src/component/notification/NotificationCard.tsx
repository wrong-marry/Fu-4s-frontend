import * as React from "react";
// import "moment/locale/vi";
import {
  NavLink,
} from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Menu,
  // Avatar,
} from "@mantine/core";


const NotificationCard: React.FC = () => {
  return (
    <>
      <Menu trigger="hover" shadow="md" width={200}>
        <Menu.Target>
          <NotificationsIcon />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Notification</Menu.Label>
          <NavLink to={"/create-test"}>
            <Menu.Item>Noti1</Menu.Item>
          </NavLink>
          <NavLink to={"/create-test"}>
            <Menu.Item>Noti2</Menu.Item>
          </NavLink>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default NotificationCard;
