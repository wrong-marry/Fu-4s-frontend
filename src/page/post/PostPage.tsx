import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Image,
  Text,
  Group,
  RingProgress,
  Badge,
  Box,
  Card,
  CardSection,
  Divider,
  Flex,
  Center,
  Container,
  Title, Space, Textarea, Button,
} from "@mantine/core";

import { format } from "date-fns";
import Comment from "../../component/comment/CommentTag";
import { useParams } from "react-router-dom";
import LearningMaterialDetail from "../../component/learning-material/LearningMaterialDetail";
import {forEach} from "lodash";

interface Post {
  id: number;
  postTime: string;
  title: string;
  status: string | null;
  username: string;
  subjectCode: string;
  test: boolean;
}

interface Comment {
  id: number;
  date: Date;
  username: string;
  content: string;
  status: string;
}

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[] | null>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response: AxiosResponse<Post> = await axios.get(
          `http://localhost:8080/api/v1/post/get?id=${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    const fetchComments = async () => {
      try {
        const response: AxiosResponse<Comment[]> = await axios.get(
            `http://localhost:8080/api/v1/comments/post/${id}`
        )
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comment:", error);
      }
    }

    fetchPost();
    fetchComments()
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return <>
    {!post.test && <LearningMaterialDetail />}
    <Space h={"md"}/>
    <Container>
      <Title order={2}>Comment section</Title>
      {(comments == null || comments?.length == 0) ? <Text>No comments</Text> : <></>}
      {forEach(comments)?.map(
          c => {
            return <Comment key={c.id} username={c.username} content={c.content} time={c.date}></Comment>
          })}
      <Textarea size={"md"} my={"md"} placeholder={"Your comment"} autosize
                minRows={2}
                maxRows={4}></Textarea>
      <Button>Comment</Button>
    </Container>
  </>
};

export default PostPage;
