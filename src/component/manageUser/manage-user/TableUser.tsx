import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Center,
  Pagination,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Group, ActionIcon, Menu, rem } from "@mantine/core";
import {
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
  IconCheck,
} from "@tabler/icons-react";
import BanAccountModal from "./BanAccountModal";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

interface User {
  username: string;
  email: string;
  role: string;
  status: string;
}

function TableUser() {
  const pageSize = 5;
  const [activePage, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [search, setSearch] = useState("");
  const [users, SetUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };
  const [currentTab, setCurrentTab] = useState("ALL");

  const [userToBan, setuserToBan] = useState<User | null>(null);

  const [
    banAccountOpened,
    { open: openBanAccountModal, close: closeBanAccountModal },
  ] = useDisclosure(false);

  const confirmBanAccount = async () => {
    if (userToBan) {
      try {
        const token = localStorage.getItem("token");
        const url =
          userToBan.status === "ACTIVE"
            ? `http://localhost:8080/api/v1/admin/banUser?username=${userToBan.username}`
            : `http://localhost:8080/api/v1/admin/activateUser?username=${userToBan.username}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          SetUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.username === userToBan.username
                ? {
                    ...user,
                    status: userToBan.status === "ACTIVE" ? "BANNED" : "ACTIVE",
                  }
                : user
            )
          );
          closeBanAccountModal();
          notifications.show({
            title: `User ${
              userToBan.status === "ACTIVE" ? "banned" : "activated"
            }`,
            message: `"${userToBan.username}" has been ${
              userToBan.status === "ACTIVE" ? "BANNED" : "ACTIVATED"
            }!`,
            color: userToBan.status === "ACTIVE" ? "yellow" : "green",
          });
        }
      } catch (error) {
        console.error("Error changing user status:", error);
        notifications.show({
          title: "Error changing user status",
          message: `An unknown error occurred while changing status for "${userToBan.username}"`,
          color: "red",
        });
      }
    }
  };

  useEffect(() => {
    const fetchNum = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseURL = "http://localhost:8080/api/v1/admin";
        let url = "";

        if (currentTab === "ALL") {
          url = `${baseURL}/getNumUser`;
        } else if (currentTab === "Staffs") {
          url = `${baseURL}/getNumEachRole?userrole=STAFF`;
        } else if (currentTab === "Admins") {
          url = `${baseURL}/getNumEachRole?userrole=ADMIN`;
        } else if (currentTab === "General Users") {
          url = `${baseURL}/getNumEachRole?userrole=USER`;
        }
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 500) {
            navigate("/forbidden");
            return;
          }
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setNumPage(Math.ceil((data + 1) / pageSize));
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/forbidden");
      }
    };

    const fetchData = async (url: string) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 500) {
            navigate("/forbidden");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: User[] = await response.json();
        SetUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
        if (error.message.includes("500")) {
          navigate("/forbidden");
        }
      }
    };

    const baseURL = "http://localhost:8080/api/v1/admin";
    let url = "";

    if (currentTab === "ALL") {
      url = `${baseURL}/getAllUser?pageNum=${activePage}&pageSize=${pageSize}`;
    } else if (currentTab === "Staffs") {
      url = `${baseURL}/getAllByUserRole?userrole=STAFF&pageNum=${activePage}&pageSize=${pageSize}`;
    } else if (currentTab === "Admins") {
      url = `${baseURL}/getAllByUserRole?userrole=ADMIN&pageNum=${activePage}&pageSize=${pageSize}`;
    } else if (currentTab === "General Users") {
      url = `${baseURL}/getAllByUserRole?userrole=USER&pageNum=${activePage}&pageSize=${pageSize}`;
    }
    fetchData(url);
    fetchNum();
  }, [activePage, currentTab]);

  useEffect(() => {
    setPage(1);
  }, [currentTab]);

  useEffect(() => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [search, users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleGetUserClick = (username: string) => {
    navigate(`/user-detail/${username}`);
  };

  const handleBanUser = (user: User) => {
    setuserToBan(user);
    openBanAccountModal();
  };

  const All = filteredUsers.map((user) => (
    <Table.Tr className="text-xs" key={user.username}>
      <Table.Td
        className="flex items-center py-5 px-6 font-medium"
        onClick={() => handleGetUserClick(user.username)}
        style={{
          cursor: "pointer",
        }}
      >
        {user.username}
      </Table.Td>
      <Table.Td className="font-medium">{user.email}</Table.Td>
      <Table.Td></Table.Td>
      <Table.Td>
        <span
          className={`inline-block py-1 px-2 text-white rounded-full ${
            user.status === "ACTIVE"
              ? "bg-green-500"
              : user.status === "BANNED"
              ? "bg-red-500"
              : ""
          }`}
        >
          {user.status}
        </span>
      </Table.Td>
      <Table.Td className="font-medium">{user.role}</Table.Td>
      <Table.Td className="font-medium"> 03.06.2024</Table.Td>
      <Table.Td style={{ textAlign: "center" }}>
        <Group gap={0} justify="flex-end">
          <Menu
            transitionProps={{ transition: "pop" }}
            withArrow
            position="bottom-end"
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconMessages
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Send direct Notification
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconNote
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Add note
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconReportAnalytics
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                More actions
              </Menu.Item>
              <Menu.Item
                leftSection={
                  user.status === "ACTIVE" ? (
                    <IconTrash
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  ) : (
                    <IconCheck
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  )
                }
                color={user.status === "ACTIVE" ? "red" : "green"}
                onClick={() => handleBanUser(user)}
              >
                {user.status === "ACTIVE" ? "Ban account" : "Activate account"}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <section className="py-8">
      <div className="container px-4 mx-auto">
        <Card pt="md" withBorder radius="md" shadow="md">
          <div className="px-6 border-b">
            <div className="flex flex-wrap items-center mb-6">
              <h3 className="text-xl font-bold">USER MANAGEMENT</h3>
              <a className="ml-auto flex items-center py-2 px-3 text-xs text-white ">
                <span className="mr-1">
                  <SearchIcon style={{ fontSize: 30, color: "#AFABF1" }} />
                </span>
                <TextInput
                  placeholder="Search Username or Email"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.currentTarget.value);
                  }}
                  style={{ marginRight: "1rem", width: "200px" }}
                />
              </a>
            </div>
            <div>
              <a
                className={`inline-block px-4 pb-2 text-sm font-medium ${
                  currentTab === "ALL"
                    ? "border-b-2 border-gray-500"
                    : "border-b-2 border-transparent"
                }`}
                href="#"
                onClick={() => handleTabClick("ALL")}
              >
                <Text size="sm" fw='bold'>ALL</Text> 
              </a>
              <a
                className={`inline-block px-4 pb-2 text-sm font-medium ${
                  currentTab === "Staffs"
                    ? "border-b-2 border-gray-500"
                    : "border-b-2 border-transparent"
                }`}
                href="#"
                onClick={() => handleTabClick("Staffs")}
              >
                <Text size="sm" fw='bold'>Staffs</Text> 
              </a>
              <a
                className={`inline-block px-4 pb-2 text-sm font-medium ${
                  currentTab === "Admins"
                    ? "border-b-2 border-gray-500"
                    : "border-b-2 border-transparent"
                }`}
                href="#"
                onClick={() => handleTabClick("Admins")}
              >
                <Text size="sm" fw='bold'>Admins</Text> 
              </a>
              <a
                className={`inline-block px-4 pb-2 text-sm font-medium ${
                  currentTab === "General Users"
                    ? "border-b-2 border-gray-500"
                    : "border-b-2 border-transparent"
                }`}
                href="#"
                onClick={() => handleTabClick("General Users")}
              >
                <Text size="sm" fw='bold'>General Users</Text> 
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr className="text-xs text-left">
                  <Table.Th className="items-center pl-6 py-4 font-medium">
                    Account
                  </Table.Th>
                  <Table.Th className=" py-4 font-medium">Email</Table.Th>
                  <Table.Th className="py-4 font-medium">
                    Enrolled Date
                  </Table.Th>
                  <Table.Th className=" py-4 font-medium">
                    Status
                  </Table.Th>
                  <Table.Th className=" py-4 font-medium">
                    Role
                  </Table.Th>
                  <Table.Th
                    className=" py-4 font-medium"
                    style={{ width: "5px" }}
                  >
                    Uploaded Posts
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{All}</Table.Tbody>
            </Table>
          </div>
        </Card>
        <Center mt={"lg"}>
          <Pagination value={activePage} onChange={setPage} total={numPage} />
        </Center>

        <BanAccountModal
          opened={banAccountOpened}
          onClose={closeBanAccountModal}
          onConfirm={confirmBanAccount}
          userToBan={userToBan}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          margin: "20px",
        }}
      >
        <Button onClick={exportToExcel}>
          <FaFileExcel size={20} color="lightblue" /> Export to Excel
        </Button>
      </div>
    </section>
  );
}
export default TableUser;
