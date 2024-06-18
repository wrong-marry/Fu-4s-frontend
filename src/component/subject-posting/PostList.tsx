import {Center, Pagination, Paper, Table} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {POST_PAGE_SIZE, SearchRequest} from "../../page/search/SearchPage.tsx";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  link: string;
  attempts: number;
  username: string;
  postTime: string;
}

function PostList(props: { searchRequest: SearchRequest }) {
  const searchRequest = props.searchRequest;
  const [posts, setPosts] = useState<
      Post[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        let api = `http://localhost:8080/api/v1/post/getAllPost?pageSize=` + POST_PAGE_SIZE;
        if (searchRequest.isTest != null) api += `&isTest=${searchRequest.isTest}`;
        if (searchRequest.subjectCode) api += `&subjectCode=${searchRequest.subjectCode}`;
        if (currentPage) api+=`&page=${currentPage}`;
        api += `&order=${searchRequest.order}`;

        api += `&page=${searchRequest.currentPage}`;
        const data = (await axios.get(api)).data;

        setPosts(data.posts);
        setNumberOfPages(Math.ceil(data.total/POST_PAGE_SIZE));
        setLoading(false);
      } catch (error: any) {
        setError(error?.message ?? "Unknown error");
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePostClick = (id: string) => {
    navigate(`/learning-material/${id}`);
  };

  return (
      <Paper maw={"1000"} miw={"1000"}>
        <Center>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Td>Title</Table.Td>
              <Table.Td>Author</Table.Td>
              <Table.Td>Posting Time</Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {posts.map((post, index) => (
                <Table.Tr
                    key={index}>
                  <Table.Td
                  onClick={() =>
                      handlePostClick(post.id)
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                    {post.title}
                  </Table.Td>
                  <Table.Td>{post.username}</Table.Td>
                  <Table.Td>{post.postTime}</Table.Td>
                </Table.Tr>
            ))}
            {posts.length ? <></> : <Table.Tr><Table.Td>No posts found.</Table.Td></Table.Tr>}
          </Table.Tbody>
        </Table>
        </Center>
        <Center>
          <Pagination
              mt={"lg"}
              value={currentPage}
              total={numberOfPages}
              getItemProps={(page) => ({
                onClick: () => {
                  setCurrentPage(page);
                }
              })}
              getControlProps={(control) => {
                if (control === 'first') {
                  return {
                    onClick: () => {
                      setCurrentPage(1);
                    }
                  };
                }

                if (control === 'last') {
                  return {
                    onClick: () => {
                      setCurrentPage(numberOfPages);
                    }
                  };
                }

                if (control === 'next') {
                  return {
                    onClick: () => {
                      setCurrentPage(currentPage + 1);
                    }
                  };
                }

                if (control === 'previous') {
                  return {
                    onClick: () => {
                      setCurrentPage(currentPage - 1);
                    }
                  };
                }

                return {};
              }}
          />
        </Center>
    </Paper>
  ) as React.ReactElement;
}

export default PostList;
