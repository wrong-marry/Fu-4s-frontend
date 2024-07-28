import {useEffect, useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate} from "react-router-dom";
import {Card, Center, Pagination, Select, Table, Text, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";
import {Group, ActionIcon, Menu, rem} from "@mantine/core";
import {
    IconTrash,
    IconDots,
    IconCheck,
    IconEyeOff,
    IconRestore,
} from "@tabler/icons-react";
import ModalConfirm from "./ModalConfirm";
import {format} from "date-fns";
import ModalDelete from "./ModalDelete";
import ModalDenied from "./ModalDenied";
import ModalHiden from "./ModalHiden";
import ModalRestore from "./ModalRestore";
import {BASE_URL} from "../../../common/constant.tsx";

interface Post {
    id: string;
    subjectCode: string;
    title: string;
    test: boolean;
    postTime: string;
    status: string;
}

interface TablePostStaffProps {
    flag: boolean;
    setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}


function TablePostStaff({setFlag}: TablePostStaffProps) {
    const pageSize = 20;
    const [subjectFilter, setSubjectFilter] = useState<string | null>("All");
    const [subjectCodes, setSubjectCodes] = useState<string[]>([]);

    const [search, setSearch] = useState("");
    const [search1, setSearch1] = useState("");
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [activePage, setPage] = useState(1);
    const [numPage, setNumPage] = useState(1);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState("All posts");

    const [postToApproved, setpostToApproved] = useState<Post | null>(null);
    const [postToHiden, setpostToHiden] = useState<Post | null>(null);
    const [postToDelete, setpostToDelete] = useState<Post | null>(null);
    const [postToRestore, setpostToRestore] = useState<Post | null>(null);
    const [postToDenied, setpostToDenied] = useState<Post | null>(null);

    const [
        pendingPostOpened,
        {open: openModalConfirm, close: closeModalConfirm},
    ] = useDisclosure(false);

    const [
        pendingPostDelete,
        {open: openModalDelete, close: closeModalDelete},
    ] = useDisclosure(false);

    const [
        pendingPostDenied,
        {open: openModalDenied, close: closeModalDenied},
    ] = useDisclosure(false);
    const [pendingPostHiden, {open: openModalHiden, close: closeModalHiden}] =
        useDisclosure(false);
    const [
        pendingPostRestore,
        {open: openModalRestore, close: closeModalRestore},
    ] = useDisclosure(false);

    const confirmApprovedPost = async () => {
        if (postToApproved) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${BASE_URL}/api/v1/staff/approvedPost?id=${postToApproved.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setPosts(
                        (prevPosts) =>
                            prevPosts?.map((post) =>
                                post.id === postToApproved.id
                                    ? {
                                        ...post,
                                        status:
                                            postToApproved.status === "PENDING_APPROVE"
                                                ? "ACTIVE"
                                                : "PENDING_APPROVE",
                                    }
                                    : post
                            ) || []
                    );
                    setFlag(flag => !flag);
                    closeModalConfirm();
                    notifications.show({
                        title: `Change Post Status`,
                        message: `"${postToApproved.id}" has been approved!`,
                        color: "green",
                    });
                    setUpdateTrigger((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error changing Post status:", error);
                notifications.show({
                    title: "Error changing Post status",
                    message: `An unknown error occurred while changing status for "${postToApproved.id}"`,
                    color: "red",
                });
            }
        }
    };

    const confirmRestorePost = async () => {
        if (postToRestore) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${BASE_URL}/api/v1/staff/restoredPost?id=${postToRestore.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setPosts(
                        (prevPosts) =>
                            prevPosts?.map((post) =>
                                post.id === postToRestore.id
                                    ? {
                                        ...post,
                                        status:
                                            postToRestore.status === "HIDDEN"
                                                ? "ACTIVE"
                                                : "PENDING_APPROVE",
                                    }
                                    : post
                            ) || []
                    );
                    setFlag(flag => !flag);
                    closeModalRestore();
                    notifications.show({
                        title: `Change Post Status`,
                        message: `"${postToRestore.id}" has been restored!`,
                        color: "green",
                    });
                    setUpdateTrigger((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error changing Post status:", error);
                notifications.show({
                    title: "Error changing Post status",
                    message: `An unknown error occurred while changing status for "${postToRestore.id}"`,
                    color: "red",
                });
            }
        }
    };
    const confirmDeniedPost = async () => {
        if (postToDenied) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${BASE_URL}/api/v1/staff/deniedPost?id=${postToDenied.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setPosts(
                        (prevPosts) =>
                            prevPosts?.map((post) =>
                                post.id === postToDenied.id
                                    ? {
                                        ...post,
                                        status:
                                            postToDenied.status === "PENDING_APPROVE"
                                                ? "HIDDEN"
                                                : "PENDING_APPROVE",
                                    }
                                    : post
                            ) || []
                    );
                    setFlag(flag => !flag);

                    closeModalDenied();
                    notifications.show({
                        title: `Change Post Status`,
                        message: `"${postToDenied.id}" has been denied!`,
                        color: "red",
                    });
                    setUpdateTrigger((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error changing Post status:", error);
                notifications.show({
                    title: "Error changing Post status",
                    message: `An unknown error occurred while changing status for "${postToDenied.id}"`,
                    color: "red",
                });
            }
        }
    };

    const confirmHiddenPost = async () => {
        if (postToHiden) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${BASE_URL}/api/v1/staff/hidenPost?id=${postToHiden.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setPosts(
                        (prevPosts) =>
                            prevPosts?.map((post) =>
                                post.id === postToHiden.id
                                    ? {
                                        ...post,
                                        status:
                                            postToHiden.status === "ACTIVE"
                                                ? "HIDDEN"
                                                : "PENDING_APPROVE",
                                    }
                                    : post
                            ) || []
                    );
                    setFlag(flag => !flag);

                    closeModalHiden();
                    notifications.show({
                        title: `Change Post Status`,
                        message: `"${postToHiden.id}" has been HIDDEN!`,
                        color: "red",
                    });
                    setUpdateTrigger((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error changing Post status:", error);
                notifications.show({
                    title: "Error changing Post status",
                    message: `An unknown error occurred while changing status for "${postToHiden.id}"`,
                    color: "red",
                });
            }
        }
    };

    const confirmDeletePost = async () => {
        if (postToDelete) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${BASE_URL}/api/v1/staff/deletedPost?id=${postToDelete.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setPosts(
                        (prevPosts) =>
                            prevPosts?.map((post) =>
                                post.id === postToDelete.id
                                    ? {
                                        ...post,
                                        status:
                                            postToDelete.status === "PENDING_APPROVE"
                                                ? "HIDDEN"
                                                : "PENDING_APPROVE",
                                    }
                                    : post
                            ) || []
                    );
                    setFlag(flag => !flag);

                    closeModalDelete();
                    notifications.show({
                        title: `Change Post Status`,
                        message: `"${postToDelete.id}" has been deleted!`,
                        color: "green",
                    });
                    setUpdateTrigger((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error changing Post status:", error);
                notifications.show({
                    title: "Error changing Post status",
                    message: `An unknown error occurred while changing status for "${postToDelete.id}"`,
                    color: "red",
                });
            }
        }
    };

    useEffect(() => {
        const fetchNum = async () => {
            try {
                const token = localStorage.getItem("token");
                const baseURL = `${BASE_URL}/api/v1/staff`;
                let url = "";

                if (currentTab === "All posts") {
                    url = `${baseURL}/getNumAllPost`;
                } else if (currentTab === "Pending posts") {
                    url = `${baseURL}/getNumEachStatus?status=PENDING_APPROVE`;
                } else if (currentTab === "Active posts") {
                    url = `${baseURL}/getNumEachStatus?status=ACTIVE`;
                } else if (currentTab === "Hidden posts") {
                    url = `${baseURL}/getNumEachStatus?status=HIDDEN`;
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

                const data: Post[] = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
                if (error.message.includes("500")) {
                    navigate("/forbidden");
                }
            }
        };

        const baseURL = `${BASE_URL}/api/v1/staff`;
        let url = "";

        if (currentTab === "All posts") {
            url = `${baseURL}/getAllPosts?pageNum=${activePage}&pageSize=${pageSize}`;
        } else if (currentTab === "Pending posts") {
            url = `${baseURL}/getAllByPostStatus?status=PENDING_APPROVE&pageNum=${activePage}&pageSize=${pageSize}`;
        } else if (currentTab === "Active posts") {
            url = `${baseURL}/getAllByPostStatus?status=ACTIVE&pageNum=${activePage}&pageSize=${pageSize}`;
        } else if (currentTab === "Hidden posts") {
            url = `${baseURL}/getAllByPostStatus?status=HIDDEN&pageNum=${activePage}&pageSize=${pageSize}`;
        }
        fetchData(url);
        fetchNum();
    }, [activePage, currentTab, updateTrigger]);


    useEffect(() => {
        setPage(1);
    }, [currentTab]);

    useEffect(() => {
        const fetchFilteredPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const keywordParam = search1 ? `keyword=${search1}` : "";
                const subjectParam =
                    subjectFilter && subjectFilter !== "All"
                        ? `&subject=${subjectFilter}`
                        : "";
                const response = await fetch(
                    `${BASE_URL}/api/v1/staff/searchAndFilterPosts?${keywordParam}${subjectParam}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setError("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredPosts();
    }, [subjectFilter, search1]);


    useEffect(() => {
        const fetchSubjectCodes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${BASE_URL}/api/v1/subject/getAllSubjectCodes`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setSubjectCodes(data); // Giả sử API trả về mảng các subject codes
                } else {
                    // Xử 	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {		console.error("Failed to fetch subject codes");
                }
            } catch (error) {
                console.error("Error fetching subject codes:", error);
            }
        };

        fetchSubjectCodes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleGetPostClick = (Postname: string) => {
        navigate(`/post/${Postname}`);
    };

    const handleApprovedPost = (post: Post) => {
        setpostToApproved(post);
        openModalConfirm();
    };

    const handleDeniedPost = (post: Post) => {
        setpostToDenied(post);
        openModalDenied();
    };

    const handleHidePost = (post: Post) => {
        setpostToHiden(post);
        openModalHiden();
    };

    const handleDeletePost = (post: Post) => {
        setpostToDelete(post);
        openModalDelete();
    };

    const handleRestorePost = (post: Post) => {
        setpostToRestore(post);
        openModalRestore();
    };

    const PendingPost = posts?.map((post) => (
        <Table.Tr className="text-" key={post.id}>
            <Table.Td
                className="flex items-center py-5 px-6 font-medium"
                onClick={() => handleGetPostClick(post.id)}
                style={{
                    cursor: "pointer",
                }}
            >
                {post.id}
            </Table.Td>
            <Table.Td className="font-medium">{post.subjectCode}</Table.Td>
            <Table.Td
                onClick={() => handleGetPostClick(post.id)}
                style={{
                    cursor: "pointer",
                }}
            >
                {post.title}
            </Table.Td>
            <Table.Td>
					<span
                        className={`inline-block py-1 px-2 text-white rounded-full ${
                            post.status === "ACTIVE"
                                ? "bg-green-500"
                                : post.status === "HIDDEN"
                                    ? "bg-red-500"
                                    : post.status === "PENDING_APPROVE"
                                        ? "bg-yellow-500"
                                        : ""
                        }`}
                    >
						{post.status}
					</span>
            </Table.Td>
            <Table.Td className="font-medium">
                {format(new Date(post.postTime), "dd/MM/yyyy HH:mm")}
            </Table.Td>
            <Table.Td c="dark" className="font-medium">
					<span
                        className={`inline-block font-semibold py-1 px-2 rounded ${
                            post.test === true
                                ? "bg-blue-200" // Lighter pastel green
                                : post.test === false
                                    ? "bg-purple-200" // Lighter pastel red
                                    : ""
                        }`}
                    >
						{post.test === true
                            ? "Mock Test"
                            : post.test === false
                                ? "Learning Material"
                                : ""}
					</span>
            </Table.Td>
            <Table.Td style={{textAlign: "center"}}>
                <Group gap={0} justify="flex-end">
                    <Menu
                        transitionProps={{transition: "pop"}}
                        withArrow
                        position="bottom-end"
                        withinPortal
                    >
                        {currentTab !== "All posts" && (
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray">
                                    <IconDots
                                        style={{width: rem(16), height: rem(16)}}
                                        stroke={1.5}
                                    />
                                </ActionIcon>
                            </Menu.Target>
                        )}
                        <Menu.Dropdown>
                            {currentTab === "Pending posts" && (
                                <>
                                    <Menu.Item
                                        leftSection={
                                            <IconCheck
                                                style={{width: rem(16), height: rem(16)}}
                                                stroke={1.5}
                                            />
                                        }
                                        onClick={() => handleApprovedPost(post)}
                                    >
                                        Approved this post
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={
                                            <IconTrash
                                                style={{width: rem(16), height: rem(16)}}
                                                stroke={1.5}
                                            />
                                        }
                                        onClick={() => handleDeniedPost(post)}
                                    >
                                        Denied this post
                                    </Menu.Item>
                                </>
                            )}
                            {currentTab === "Active posts" && (
                                <Menu.Item
                                    leftSection={
                                        <IconEyeOff
                                            style={{width: rem(16), height: rem(16)}}
                                            stroke={1.5}
                                        />
                                    }
                                    onClick={() => handleHidePost(post)}
                                >
                                    Hide this post
                                </Menu.Item>
                            )}
                            {currentTab === "Hidden posts" && (
                                <>
                                    <Menu.Item
                                        leftSection={
                                            <IconTrash
                                                style={{width: rem(16), height: rem(16)}}
                                                stroke={1.5}
                                            />
                                        }
                                        onClick={() => handleDeletePost(post)}
                                    >
                                        Delete this post
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={
                                            <IconRestore
                                                style={{width: rem(16), height: rem(16)}}
                                                stroke={1.5}
                                            />
                                        }
                                        onClick={() => handleRestorePost(post)}
                                    >
                                        Restore this post
                                    </Menu.Item>
                                </>
                            )}
                            {currentTab === "All posts" && <></>}
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    )) || <></>;

    const handleTabClick = (tab: string) => {
        setCurrentTab(tab);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearch1(e.currentTarget.value);
            // Thực hiện hành động tìm kiếm ở đây (ví dụ: gọi hàm searchPosts(search) hoặc tương tự)
        }
    };
    return (
        <section className="py-8">
            <Card withBorder radius="md" shadow="md">
                <div className="container px-4 mx-auto">
                    <div className="px-6 border-b">
                        <div className="flex flex-wrap items-center mb-6">
                            <h3 className="text-xl font-bold">POST MANAGEMENT</h3>
                            <div className="ml-auto flex items-center">
								<span>
									<h3 className="mr-1">Subject : </h3>
								</span>
                                <Select
                                    placeholder="Filter by subject"
                                    data={["All", ...subjectCodes]}
                                    value={subjectFilter}
                                    onChange={(value) => setSubjectFilter(value)}
                                    style={{marginRight: "1rem"}}
                                />
                            </div>
                            <div className="ml-auto flex items-center py-2 px-3 text-xs text-white">
								<span className="mr-1">
									<SearchIcon style={{fontSize: 30, color: "#AFABF1"}}/>
								</span>
                                <TextInput
                                    placeholder="Search by Post ID or Title"
                                    value={search}
                                    onChange={(e) => setSearch(e.currentTarget.value)}
                                    onKeyUp={handleSearch}
                                    style={{marginRight: "1rem", width: "200px"}}
                                />
                            </div>
                        </div>

                        <div className="my-0">
                            <a
                                className={`inline-block px-4 pb-2 text-sm font-medium ${
                                    currentTab === "All posts"
                                        ? "border-b-2 border-gray-500"
                                        : "border-b-2 border-transparent"
                                }`}
                                href="#"
                                onClick={() => handleTabClick("All posts")}
                            >
                                <Text size="sm" fw="bold">
                                    All posts
                                </Text>
                            </a>
                            <a
                                className={`inline-block px-4 pb-2 text-sm font-medium ${
                                    currentTab === "Pending posts"
                                        ? "border-b-2 border-gray-500"
                                        : "border-b-2 border-transparent"
                                }`}
                                href="#"
                                onClick={() => handleTabClick("Pending posts")}
                            >
                                <Text size="sm" fw="bold">
                                    Pending posts
                                </Text>
                            </a>
                            <a
                                className={`inline-block px-4 pb-2 text-sm font-medium ${
                                    currentTab === "Hidden posts"
                                        ? "border-b-2 border-gray-500"
                                        : "border-b-2 border-transparent"
                                }`}
                                href="#"
                                onClick={() => handleTabClick("Hidden posts")}
                            >
                                <Text size="sm" fw="bold">
                                    Hidden posts
                                </Text>
                            </a>
                            <a
                                className={`inline-block px-4 pb-2 text-sm font-medium ${
                                    currentTab === "Active posts"
                                        ? "border-b-2 border-gray-500"
                                        : "border-b-2 border-transparent"
                                }`}
                                href="#"
                                onClick={() => handleTabClick("Active posts")}
                            >
                                <Text size="sm" fw="bold">
                                    Active posts
                                </Text>
                            </a>
                        </div>
                    </div>
                    <Table className="table-auto w-full">
                        <Table.Thead>
                            <Table.Tr className="text-xs text-gray-500 text-left">
                                <Table.Th className="flex items-center pl-6 py-4 font-medium">
                                    Post ID
                                </Table.Th>
                                <Table.Th className="py-4 font-medium">Subject</Table.Th>
                                <Table.Th className="py-4 font-medium">Title</Table.Th>
                                <Table.Th className="py-4 font-medium">Status</Table.Th>

                                <Table.Th className="py-4 font-medium" style={{width: "5px"}}>
                                    Post Time
                                </Table.Th>
                                <Table.Th className="py-4 font-medium">Type</Table.Th>
                                {currentTab !== "All posts" && (
                                    <Table.Th className="py-4 font-medium">Action</Table.Th>
                                )}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{PendingPost}</Table.Tbody>
                    </Table>
                </div>

                <Center mt={"lg"}>
                    <Pagination value={activePage} onChange={setPage} total={numPage}/>
                </Center>
            </Card>
            <ModalConfirm
                opened={pendingPostOpened}
                onClose={closeModalConfirm}
                onConfirm={confirmApprovedPost}
            />
            <ModalDelete
                opened={pendingPostDelete}
                onClose={closeModalDelete}
                onConfirm={confirmDeletePost}
            />
            <ModalDenied
                opened={pendingPostDenied}
                onClose={closeModalDenied}
                onConfirm={confirmDeniedPost}
            />
            <ModalHiden
                opened={pendingPostHiden}
                onClose={closeModalHiden}
                onConfirm={confirmHiddenPost}
            />
            <ModalRestore
                opened={pendingPostRestore}
                onClose={closeModalRestore}
                onConfirm={confirmRestorePost}
            />
        </section>
    );
}

export default TablePostStaff;
