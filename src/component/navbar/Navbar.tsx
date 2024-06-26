import {
  Button,
  Menu,
  rem,
  Avatar,
  Group,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
  Grid,
  GridCol,
  Flex,
  Burger,
  em,
} from "@mantine/core";
import logo from "../../asset/logo.png";
import darkLogo from "../../asset/darkLogo.png";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import {
  IconPhoto,
  IconLibraryPlus,
  IconSquarePlus,
  IconSettings,
  IconUserCircle,
  IconPremiumRights,
  IconLogout,
  IconDeviceLaptop,
} from "@tabler/icons-react";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import React, { useContext, useEffect } from "react";
import {
  UserCredentials,
  UserCredentialsContext,
} from "../../store/user-credentials-context";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import GeneralSearchBar from "./search/GeneralSearchBar.tsx";

import { Logout } from "../../util/loader/Auth.tsx";

import NotificationCard from "../notification/NotificationCard.tsx";

const userBtn = (data: LoaderData, handleLogout: () => void) => {
  const isMobile = useMediaQuery(`(max-width: ${em(500)})`);
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Group className="cursor-pointer border-none">
            <Avatar
              variant="filled"
              radius="xl"
              color="grape"
              className="cursor-pointer"
              // src={data?.avatar}
            />
            <Text display={isMobile?"none":"block"} className="text-sm font-semibold">
              {data ? data.firstName + " " + data.lastName : "Guest"}
            </Text>
          </Group>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Menu</Menu.Label>
          <NavLink to={"/user"}>
            <Menu.Item
              leftSection={
                <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Profile
            </Menu.Item>
          </NavLink>

          <NavLink to={"/user/post"}>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Manage Posts
            </Menu.Item>
          </NavLink>

          <NavLink to={"/test-result"}>
            <Menu.Item
              leftSection={
                <IconPremiumRights
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Test History
            </Menu.Item>
          </NavLink>

          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  ) as React.ReactElement;
};

const adminBtn = (data: LoaderData, handleLogout: () => void) => {
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Group className="cursor-pointer border-none">
            <Avatar
              variant="filled"
              radius="xl"
              color="grape"
              className="cursor-pointer"
              // src={data?.avatar}
            />
            <Text className="text-sm font-semibold">
              {data ? data.firstName + " " + data.lastName : "Guest"}
            </Text>
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Menu</Menu.Label>
          <NavLink to={"/user"}>
            <Menu.Item
              leftSection={
                <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Profile
            </Menu.Item>
          </NavLink>

          <NavLink to={"/user/post"}>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Manage Posts
            </Menu.Item>
          </NavLink>
          <NavLink to={"/test-result"}>
            <Menu.Item
              leftSection={
                <IconPremiumRights
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Test History
            </Menu.Item>
          </NavLink>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <IconDeviceLaptop className="cursor-pointer w-5 h-5" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Admin Menu</Menu.Label>
          <NavLink to={"/admin/manage-user"}>
            <Menu.Item
              leftSection={
                <IconDeviceLaptop style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Join your workspace
            </Menu.Item>
          </NavLink>
        </Menu.Dropdown>
      </Menu>
    </>
  ) as React.ReactElement;
};
const staffBtn = (data: LoaderData, handleLogout: () => void) => {
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Group className="cursor-pointer border-none">
            <Avatar
              variant="filled"
              radius="xl"
              color="grape"
              className="cursor-pointer"
              // src={data?.avatar}
            />
            <Text className="text-sm font-semibold">
              {data ? data.firstName + " " + data.lastName : "Guest"}
            </Text>
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Menu</Menu.Label>
          <NavLink to={"/user"}>
            <Menu.Item
              leftSection={
                <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Profile
            </Menu.Item>
          </NavLink>

          <NavLink to={"/user/post"}>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Manage Posts
            </Menu.Item>
          </NavLink>

          <Menu.Item
            leftSection={
              <IconPremiumRights style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Upgrade to Premium
          </Menu.Item>

          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <IconDeviceLaptop className="cursor-pointer w-5 h-5" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Staff Menu</Menu.Label>
          <NavLink to={"/staff/manage-post"}>
            <Menu.Item
              leftSection={
                <IconDeviceLaptop style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Join your workspace
            </Menu.Item>
          </NavLink>
        </Menu.Dropdown>
      </Menu>
    </>
  ) as React.ReactElement;
};

const guestBtn = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate("/auth")}
        variant={"light"}
        color="indigo"
        radius="md"
        fz="sm"
      >
        Login
      </Button>

      <Button
        onClick={() => navigate("/auth/register")}
        variant="filled"
        color="indigo"
        radius="md"
        fz="sm"
      >
        Signup
      </Button>
    </>
  );
};

export interface LoaderData {
  error?: boolean;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

function Navbar(props: any) {
  const [, { open }] = useDisclosure(false);

  const { assignUserCredentials } = useContext(UserCredentialsContext);
  const data: LoaderData = useLoaderData() as LoaderData;
  useEffect(() => {
    if (data !== null) {
      assignUserCredentials({
        ...data,
      } as unknown as UserCredentials);
    }
  }, [data]);

  // useEffect(() => {
  //   if (data?.banned) {
  //     submit(null, { method: "post", action: "/logout" });
  //     toast.error("Your account has been banned");
  //   }
  // }, [data]);
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("light");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const btnState = data?.error || !data ? guestBtn() : userBtn(data, Logout);

  const whichHomepage = "";

  return (
    <Grid align="center">
      <Grid.Col span={{ base: 7, sm: 3.5 }} >
        <Flex align="center" justify="flex-start">
          <Burger
            ml="lg"
            mr='md'
            opened={props.opened}
            onClick={props.setOpened}
            size="sm"
          />
          <NavLink to={whichHomepage}>
            <img
              className="h-12 w-36 overflow-hidden"
              src={computedColorScheme === "dark" ? darkLogo : logo}
              alt="Dark FU4S logo"
            />
          </NavLink>
        </Flex>
      </Grid.Col>

      <Grid.Col span={{ base: 11, sm: 5 }} offset={{ base: 0.5, sm: 0 }} order={{base:3,sm:2}}>
        <GeneralSearchBar />
      </Grid.Col>

      <Grid.Col span={{base:5,sm:3.5}}  order={{base:2,sm:3}}>
        <Flex align='center' justify='flex-end' mx='md'>
         
          {data &&
            (data.role === "ADMIN" ||
              data.role === "STAFF" ||
              data.role === "USER")}
          <Group>{btnState}</Group>
 
          <DarkModeSwitch className="ml-5"
            checked={colorScheme === "dark"}
            onChange={toggleColorScheme}
            size={25}
          />
        </Flex>
      </Grid.Col>
    </Grid>
  );
}

export default Navbar;
