import * as React from "react";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import "moment/locale/vi";
import {
  NavLink,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Button,
  Menu,
  rem,
  // Avatar,
  Group,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import logo from "../../asset/logo.png";
import darkLogo from "../../asset/darkLogo.png";
import {
  IconPhoto,
  IconLibraryPlus,
  IconSquarePlus,
  IconSettings,
  IconUserCircle,
  IconPremiumRights,
  IconLogout,
} from "@tabler/icons-react";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import { UserCredentialsContext } from "../../store/user-credentials-context";
import { useDisclosure } from "@mantine/hooks";

const PAGE_SIZE = 5;
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
