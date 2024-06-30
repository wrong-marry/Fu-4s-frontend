import React, {useEffect, useState} from "react";
import {
    ActionIcon,
    TextInput,
    Button,
    Select,
    Menu,
    Table,
    Card,
} from "@mantine/core";
import {
    IconDots,
    IconSortAscending,
    IconSortDescending,
} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import EditSubjectModal from "./EditSubjectModal";
import CreateSubjectModal from "./CreateSubjectModal";
import {notifications} from "@mantine/notifications";
import DisableSubjectModal from "./DisableSubjectModal";
import ActivateSubjectModal from "./ActivateSubjectModal";
import {loadingIndicator} from "../../App.tsx";

export interface Subject {
    code: string;
    name: string;
    semester: number;
    active: boolean;
}

function TableSubject() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [semesterFilter, setSemesterFilter] = useState<string | null>("All");
    const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
    const [subjectToDisable, setSubjectToDisable] = useState<Subject | null>(
        null
    );
    const [subjectToActivate, setSubjectToActivate] = useState<Subject | null>(
        null
    );
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [
        editModalOpened,
        {open: openEditSubjectModal, close: closeEditSubjectModal},
    ] = useDisclosure(false);
    const [
        createModalOpened,
        {open: openCreateSubjectModal, close: closeCreateSubjectModal},
    ] = useDisclosure(false);
    const [
        disableModalOpened,
        {open: openDisableSubjectModal, close: closeDisableSubjectModal},
    ] = useDisclosure(false);
    const [
        activeModalOpened,
        {open: openActivateSubjectModal, close: closeActivateSubjectModal},
    ] = useDisclosure(false);

    const [allSubject, setAllSubject] = useState(0);
    const [activeSubject, setActiveSubject] = useState(0);
    const [disabledSubject, setDisabledSubject] = useState(0);

    useEffect(() => {
        const fetchAllSubject = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/admin/getNumSubject`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setAllSubject(data);
            } catch (error) {
                console.error("Error fetching all subjects:", error);
            }
        };

        const fetchActiveSubject = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/admin/getNumSubjectsByType?isActive=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setActiveSubject(data);
            } catch (error) {
                console.error("Error fetching active subjects:", error);
            }
        };

        const fetchDisabledSubject = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/admin/getNumSubjectsByType?isActive=false`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setDisabledSubject(data);
            } catch (error) {
                console.error("Error fetching disabled subjects:", error);
            }
        };

        fetchAllSubject();
        fetchActiveSubject();
        fetchDisabledSubject();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8080/api/v1/subject/getAll`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Subject[] = await response.json();
                setSubjects(data);
                setFilteredSubjects(data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = subjects;

        if (semesterFilter !== "All") {
            filtered = filtered.filter(
                (subject) => subject.semester.toString() === semesterFilter
            );
        }

        if (search) {
            filtered = filtered.filter(
                (subject) =>
                    subject.code.toLowerCase().includes(search.toLowerCase()) ||
                    subject.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy) {
            filtered = filtered.sort((a, b) => {
                let aField = a[sortBy as keyof Subject];
                let bField = b[sortBy as keyof Subject];

                if (typeof aField === "string") aField = aField.toLowerCase();
                if (typeof bField === "string") bField = bField.toLowerCase();

                if (aField < bField) return sortOrder === "asc" ? -1 : 1;
                if (aField > bField) return sortOrder === "asc" ? 1 : -1;

                return 0;
            });
        }

        setFilteredSubjects(filtered);
    }, [search, semesterFilter, subjects, sortBy, sortOrder]);

    if (loading) {
        return loadingIndicator;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleEditClick = (subject: Subject) => {
        setCurrentSubject(subject);
        openEditSubjectModal();
    };

    const handleDisableClick = (subject: Subject) => {
        setSubjectToDisable(subject);
        openDisableSubjectModal();
    };

    const handleActivateClick = (subject: Subject) => {
        setSubjectToActivate(subject);
        openActivateSubjectModal();
    };

    const confirmDisable = async () => {
        if (subjectToDisable) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8080/api/v1/admin/disableSubject?subjectCode=${subjectToDisable.code}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setSubjects((prevSubjects) =>
                        prevSubjects.map((subject) =>
                            subject.code === subjectToDisable.code
                                ? {...subject, active: false}
                                : subject
                        )
                    );
                    setActiveSubject((prev) => prev - 1);
                    setDisabledSubject((prev) => prev + 1);
                    closeDisableSubjectModal();
                    notifications.show({
                        title: "Subject disabled",
                        message: `"${subjectToDisable.name}" has been disabled!`,
                        color: "blue",
                    });
                }
            } catch (error) {
                console.error("Error deactivating subject:", error);
                notifications.show({
                    title: "Error deactivating subject",
                    message: `An unknown error occurred while deactivating "${subjectToDisable.name}"`,
                    color: "red",
                });
            }
        }
    };

    const confirmActivate = async () => {
        if (subjectToActivate) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8080/api/v1/admin/activeSubject?subjectCode=${subjectToActivate.code}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    setSubjects((prevSubjects) =>
                        prevSubjects.map((subject) =>
                            subject.code === subjectToActivate.code
                                ? {...subject, active: true}
                                : subject
                        )
                    );
                    setActiveSubject((prev) => prev + 1);
                    setDisabledSubject((prev) => prev - 1);
                    closeActivateSubjectModal();
                    notifications.show({
                        title: "Subject activated",
                        message: `"${subjectToActivate.name}" has been activated!`,
                        color: "blue",
                    });
                }
            } catch (error) {
                console.error("Error activating subject:", error);
                notifications.show({
                    title: "Error activating subject",
                    message: `An unknown error occurred while activating "${subjectToActivate.name}"`,
                    color: "red",
                });
            }
        }
    };

    const handleCreateClick = () => {
        setCurrentSubject({code: "", name: "", semester: 1, active: true});
        openCreateSubjectModal();
    };

    const handleUpdateClick = async () => {
        if (currentSubject) {
            try {
                const token = localStorage.getItem("token");
                await fetch(`http://localhost:8080/api/v1/admin/updateSubject`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(currentSubject),
                });

                setSubjects((prevSubjects) =>
                    prevSubjects.map((subject) =>
                        subject.code === currentSubject.code ? currentSubject : subject
                    )
                );

                closeEditSubjectModal();
            } catch (error) {
                console.error("Error saving subject:", error);
            }
        }
    };
    const handleSaveClick = async () => {
        if (currentSubject) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8080/api/v1/admin/createSubject`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(currentSubject),
                    }
                );

                const responseMessage = await response.text();

                if (response.ok) {
                    setSubjects((prevSubjects) => [...prevSubjects, currentSubject]);
                    notifications.show({
                        title: "Subject created",
                        message: responseMessage,
                        color: "green",
                    });
                }

                closeCreateSubjectModal();
            } catch (error) {
                console.error("Error saving subject:", error);
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        if (currentSubject) {
            setCurrentSubject({...currentSubject, [name]: value});
        }
    };

    const handleSortClick = (field: string) => {
        setSortBy(field);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const subjectsList = filteredSubjects.map((subject) => (
        <Table.Tr className="text-xs " key={subject.code}>
            <Table.Td className="py-5 px-6 font-medium">{subject.code}</Table.Td>
            <Table.Td className="font-medium">{subject.name}</Table.Td>
            <Table.Td className="font-medium">{subject.semester}</Table.Td>
            <Table.Td className="font-medium">
        <span
            className={`inline-block py-1 px-2 text-white rounded-full ${
                subject.active ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {subject.active ? "Active" : "Disabled"}
        </span>
            </Table.Td>
            <Table.Td style={{textAlign: "center"}}>
                <Menu transitionProps={{transition: "pop"}} withArrow>
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDots/>
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item onClick={() => handleEditClick(subject)}>
                            Edit Subject
                        </Menu.Item>

                        {subject.active ? (
                            <Menu.Item onClick={() => handleDisableClick(subject)}>
                                Disable Subject
                            </Menu.Item>
                        ) : (
                            <Menu.Item onClick={() => handleActivateClick(subject)}>
                                Activate Subject
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <section className="shadow pb-4">
            <div className="container px-4 mx-auto ">
                <div>
                    <h3 className="text-xl font-bold w-full w-auto p-5">
                        SUBJECT STATISTICS
                    </h3>
                </div>
                <div className="flex flex-wrap -m-3">
                    <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                        <div className="p-6 pb-10 border border-coolGray-100 rounded-md shadow-dashboard">
                            <div className="flex flex-wrap items-end justify-center -m-2 mb-3">
                                <div className="w-auto p-2">
                                    <h3 className="text-sm text-coolGray-500 font-medium">
                                        Active Subjects
                                    </h3>
                                </div>
                            </div>
                            <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                                {activeSubject}
                            </h2>
                            <p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full mt-2">
                                Active
                            </p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                        <div className="p-6 pb-10 border border-coolGray-100 rounded-md shadow-dashboard">
                            <div className="flex flex-wrap items-end justify-center -m-2 mb-3">
                                <div className="w-auto p-2">
                                    <h3 className="text-center text-sm text-coolGray-500 font-medium">
                                        Disabled Subjects
                                    </h3>
                                </div>
                            </div>
                            <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                                {disabledSubject}
                            </h2>
                            <p className="text-center max-w-max mx-auto px-2 py-1 text-red-500 font-medium text-xs bg-red-100 rounded-full mt-2">
                                Disabled
                            </p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                        <div className="p-6 pb-10 border border-coolGray-100 rounded-md shadow-dashboard">
                            <div className="flex flex-wrap items-end justify-center -m-2 mb-3">
                                <div className="w-auto p-2">
                                    <h3 className="text-sm text-coolGray-500 font-medium">
                                        All Subjects
                                    </h3>
                                </div>
                            </div>
                            <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                                {allSubject}
                            </h2>
                            <p className="text-center max-w-max mx-auto px-2 py-1 text-yellow-500 font-medium text-xs bg-yellow-100 rounded-full mt-2">
                                All
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Card radius="md" shadow="md" withBorder pt="md" mt='lg'>
                <div className="container px-4 mx-auto">
                    <div className="px-6 border-b">
                        <div className="flex flex-wrap items-center mb-6 mt-6">
                            <h3 className="text-xl font-bold">SUBJECT MANAGEMENT</h3>
                            <div className="ml-auto flex items-center">
                                <span>Semester: </span>
                                <Select
                                    placeholder="Filter by semester"
                                    data={["All", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                                    value={semesterFilter}
                                    onChange={(value) => setSemesterFilter(value)}
                                    style={{marginRight: "1rem"}}
                                />
                                <TextInput
                                    placeholder="Search Subject"
                                    value={search}
                                    onChange={(e) => setSearch(e.currentTarget.value)}
                                    style={{marginRight: "1rem"}}
                                />
                                <Button
                                    style={{marginRight: "1rem"}}
                                    className="ml-auto"
                                    onClick={handleCreateClick}
                                >
                                    New Subject
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr className="text-xs text-gray-500 text-left">
                                <Table.Th
                                    className="pl-6 py-4 font-medium"
                                    onClick={() => handleSortClick("code")}
                                    style={{cursor: "pointer"}}
                                >
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <span>Code</span>
                                        {sortBy === "code" && (
                                            <span className="ml-2">
                        {sortOrder === "asc" ? (
                            <IconSortAscending/>
                        ) : (
                            <IconSortDescending/>
                        )}
                      </span>
                                        )}
                                    </div>
                                </Table.Th>

                                <Table.Th
                                    className="py-4 font-medium"
                                    onClick={() => handleSortClick("name")}
                                    style={{cursor: "pointer"}}
                                >
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <span>Name</span>
                                        {sortBy === "name" && (
                                            <span className="ml-2">
                        {sortOrder === "asc" ? (
                            <IconSortAscending/>
                        ) : (
                            <IconSortDescending/>
                        )}
                      </span>
                                        )}
                                    </div>
                                </Table.Th>
                                <Table.Th
                                    className="py-4 font-medium"
                                    onClick={() => handleSortClick("semester")}
                                    style={{cursor: "pointer"}}
                                >
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <span>Semester</span>
                                        {sortBy === "semester" && (
                                            <span className="ml-2">
                        {sortOrder === "asc" ? (
                            <IconSortAscending/>
                        ) : (
                            <IconSortDescending/>
                        )}
                      </span>
                                        )}
                                    </div>
                                </Table.Th>
                                <Table.Th
                                    className="py-4 font-medium"
                                    onClick={() => handleSortClick("status")}
                                    style={{cursor: "pointer"}}
                                >
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <span>Status</span>
                                        {sortBy === "status" && (
                                            <span className="ml-2">
                        {sortOrder === "asc" ? (
                            <IconSortAscending/>
                        ) : (
                            <IconSortDescending/>
                        )}
                      </span>
                                        )}
                                    </div>
                                </Table.Th>
                                <Table.Th className="py-4 font-medium">
                                    <span>Options</span>
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{subjectsList}</Table.Tbody>
                    </Table>
                </div>
            </Card>
            <EditSubjectModal
                opened={editModalOpened}
                onClose={closeEditSubjectModal}
                onSave={handleUpdateClick}
                subject={
                    currentSubject || {
                        code: "",
                        name: "",
                        semester: 1,
                        active: true,
                    }
                }
                onInputChange={handleInputChange}
            />
            <CreateSubjectModal
                opened={createModalOpened}
                onClose={closeCreateSubjectModal}
                onSave={handleSaveClick}
                subject={
                    currentSubject || {
                        code: "",
                        name: "",
                        semester: 1,
                        active: true,
                    }
                }
                onInputChange={handleInputChange}
            />
            <DisableSubjectModal
                opened={disableModalOpened}
                onClose={closeDisableSubjectModal}
                onConfirm={confirmDisable}
            />
            <ActivateSubjectModal
                opened={activeModalOpened}
                onClose={closeActivateSubjectModal}
                onConfirm={confirmActivate}
            />
        </section>
    );
}

export default TableSubject;
