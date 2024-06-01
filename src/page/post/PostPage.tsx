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
  Title,
} from "@mantine/core";

import { format } from "date-fns";
import { useParams } from "react-router-dom";
import LearningMaterialDetail from "../../component/learning-material/LearningMaterialDetail";
import QuestionPage from "../question-page/QuestionPage";
import MockTestDetailPage from "../mock-test-detail-page/MockTestDetailPage";

interface Post {
  id: number;
  postTime: string;
  title: string;
  status: string | null;
  username: string;
  subjectCode: string;
  test: boolean;
}

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);

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

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return <>{post.test ? <MockTestDetailPage {...post}/> : <LearningMaterialDetail />}</>;
};

export default PostPage;
