import React, { useEffect, useState } from "react";
import { ActionIcon, TextInput, Button, Select, Text } from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconPlus,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EditSubjectModal from "./EditSubjectModal";
import CreateSubjectModal from "./CreateSubjectModal";
import DeleteSubjectModal from "./DeleteSubjectModal";
import { notifications } from "@mantine/notifications";

interface Subject {
  code: string;
  name: string;
  semester: number;
}

function TableSubject() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string | null>("All");
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [
    editModalOpened,
    { open: openEditSubjectModal, close: closeEditSubjectModal },
  ] = useDisclosure(false);
  const [
    createModalOpened,
    { open: openCreateSubjectModal, close: closeCreateSubjectModal },
  ] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteSubjectModal, close: closeDeleteSubjectModal },
  ] = useDisclosure(false);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleEditClick = (subject: Subject) => {
    setCurrentSubject(subject);
    openEditSubjectModal();
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    openDeleteSubjectModal();
  };

  const confirmDelete = async () => {
    if (subjectToDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/v1/admin/deleteSubject?subjectCode=${subjectToDelete.code}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setSubjects(
            subjects.filter((subject) => subject.code !== subjectToDelete.code)
          );
          closeDeleteSubjectModal();

          notifications.show({
            title: "Subject deleted",
            message: `${subjectToDelete.name}" has been deleted!`,
            color: "blue",
          });
        } else {
          // Xảy ra lỗi khi xóa subject
          console.error("Error deleting subject:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  const handleCreateClick = () => {
    setCurrentSubject({ code: "", name: "", semester: 1 });
    openCreateSubjectModal();
  };

  const handleSaveClick = async () => {
    if (currentSubject) {
      try {
        const token = localStorage.getItem("token");
        const method = currentSubject.code ? "PUT" : "POST";
        const url = currentSubject.code
          ? `http://localhost:8080/api/v1/admin/updateSubject`
          : `http://localhost:8080/api/v1/admin/createSubject`;

        await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentSubject),
        });

        if (method === "POST") {
          setSubjects([...subjects, currentSubject]);
        } else {
          setSubjects(
            subjects.map((subject) =>
              subject.code === currentSubject.code ? currentSubject : subject
            )
          );
        }

        closeEditSubjectModal();
        closeCreateSubjectModal();
      } catch (error) {
        console.error("Error saving subject:", error);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (currentSubject) {
      setCurrentSubject({ ...currentSubject, [name]: value });
    }
  };

  const handleSortClick = (field: string) => {
    setSortBy(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const subjectsList = filteredSubjects.map((subject) => (
    <tr className="text-xs bg-gray-50" key={subject.code}>
      <td className="py-5 px-6 font-medium">{subject.code}</td>
      <td className="font-medium">{subject.name}</td>
      <td className="font-medium">{subject.semester}</td>

      <td style={{ textAlign: "center" }}>
        <ActionIcon
          variant="outline"
          size="lg"
          radius="xl"
          onClick={() => handleEditClick(subject)}
        >
          <IconPencil />
        </ActionIcon>
      </td>
      <td style={{ textAlign: "center" }}>
        <ActionIcon
          variant="outline"
          size="lg"
          radius="xl"
          color="red"
          onClick={() => handleDeleteClick(subject)}
        >
          <IconTrash />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <section className="py-8">
      <div className="container px-4 mx-auto">
        <div className="pt-6 bg-white shadow rounded">
          <div className="px-6 border-b">
            <div className="flex flex-wrap items-center mb-6">
              <h3 className="text-xl font-bold">SUBJECT MANAGEMENT</h3>
              <div className="ml-auto flex items-center">
                <TextInput
                  placeholder="Search Subject"
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  style={{ marginRight: "1rem" }}
                />
                <Select
                  placeholder="Filter by semester"
                  data={["All", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                  value={semesterFilter}
                  onChange={(value) => setSemesterFilter(value)}
                  style={{ marginRight: "1rem" }}
                />
                <Button
                  style={{ marginRight: "1rem" }}
                  className="ml-auto"
                  onClick={handleCreateClick}
                >
                  New Subject
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="text-xs text-gray-500 text-left">
                  <th
                    className="pl-6 py-4 font-medium"
                    onClick={() => handleSortClick("code")}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Code</span>
                    {sortBy === "code" && (
                      <span className="ml-2">
                        {sortOrder === "asc" ? (
                          <IconSortAscending />
                        ) : (
                          <IconSortDescending />
                        )}
                      </span>
                    )}
                  </th>
                  <th
                    className="py-4 font-medium"
                    onClick={() => handleSortClick("name")}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Name</span>
                    {sortBy === "name" && (
                      <span className="ml-2">
                        {sortOrder === "asc" ? (
                          <IconSortAscending />
                        ) : (
                          <IconSortDescending />
                        )}
                      </span>
                    )}
                  </th>
                  <th
                    className="py-4 font-medium"
                    onClick={() => handleSortClick("semester")}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Semester</span>
                    {sortBy === "semester" && (
                      <span className="ml-2">
                        {sortOrder === "asc" ? (
                          <IconSortAscending />
                        ) : (
                          <IconSortDescending />
                        )}
                      </span>
                    )}
                  </th>
                  <th className="py-4 font-medium" style={{ width: "5px" }}>
                    <span>Options</span>
                  </th>
                </tr>
              </thead>
              <tbody>{subjectsList}</tbody>
            </table>
          </div>
          <EditSubjectModal
            opened={editModalOpened}
            onClose={closeEditSubjectModal}
            onSave={handleSaveClick}
            subject={currentSubject || { code: "", name: "", semester: 1 }}
            onInputChange={handleInputChange}
          />
          <CreateSubjectModal
            opened={createModalOpened}
            onClose={closeCreateSubjectModal}
            onSave={handleSaveClick}
            subject={currentSubject || { code: "", name: "", semester: 1 }}
            onInputChange={handleInputChange}
          />
          <DeleteSubjectModal
            opened={deleteModalOpened}
            onClose={closeDeleteSubjectModal}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </section>
  );
}

export default TableSubject;
