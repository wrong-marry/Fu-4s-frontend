import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Center,
  Grid,
  Pagination,
  Table,
} from "@mantine/core";
import { BASE_URL } from "../../common/constant.tsx";

interface Post {
  id: string;
  title: string;
  status: string;
  subjectCode: string;
  postTime: string;
  test: boolean;
}

export function UserPostTable() {
  const username = localStorage.getItem("username");
  const pageSize = 5;

  const [activePage, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [posts, setPost] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      // ${localStorage.getItem('username')}
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/post/getAllByUsername?username=${username}&pageNum=${activePage}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchNum = async () => {
      // ${localStorage.getItem('username')}
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/post/getNum?username=${username}`
        );
        const data = await response.json();
        setNumPage((data + 1) / pageSize);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchNum();
    fetchPost();
  }, [activePage]);

  let num = pageSize * activePage - pageSize;
  const rows = posts.map((post) => (
    <Table.Tr key={post.id}>
      <Table.Td>
        <p>{++num}</p>
      </Table.Td>

      <Table.Td className="font-medium">
        <a href={"/post/" + post.id}>{post.title}</a>
      </Table.Td>

      <Table.Td className="font-medium">{post.postTime}</Table.Td>

      <Table.Td>
        {post.status == "ACTIVE" ? (
          <Badge bg="green">Active</Badge>
        ) : post.status == "HIDDEN" ? (
          <Badge bg="red">Hidden</Badge>
        ) : (
          <Badge bg="orange">Pending</Badge>
        )}
      </Table.Td>

      <Table.Td>{post.subjectCode}</Table.Td>

      <Table.Td>
        <Button radius="xl" className="text-white" bg="gray">
          <a href={"/edit-learning-material/" + post.id}>Edit</a>
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Grid>
        <Grid.Col span={10} offset={1}>
          <Card withBorder shadow="md" radius="lg">
            <h3 className="text-xl m-5 font-bold">Your uploaded posts</h3>
            <div>
              <a
                className="inline-block px-4 pb-2 text-sm font-medium text-indigo-500 border-b-2 border-indigo-500"
                href="/user/post"
              >
                All
              </a>
              <a
                className="inline-block px-4 pb-2 text-sm font-medium text-gray-500 border-b-2 border-transparent"
                href="/user/post/mock-test"
              >
                Mock Tests
              </a>
              <a
                className="inline-block px-4 pb-2 text-sm font-medium text-gray-500 border-b-2 border-transparent"
                href="/user/post/learning-material"
              >
                Learning Materials
              </a>
            </div>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>No</Table.Th>
                  <Table.Th className="py-4 font-medium">Title</Table.Th>
                  <Table.Th className="py-4 font-medium">Last Updated</Table.Th>
                  <Table.Th className="py-4 font-medium">Status</Table.Th>
                  <Table.Th className="py-4 font-medium">Subject</Table.Th>

                  <Table.Th className="py-4 font-medium">Options</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Center mt={"lg"}>
              <Pagination
                value={activePage}
                onChange={setPage}
                total={numPage}
              />
            </Center>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}
