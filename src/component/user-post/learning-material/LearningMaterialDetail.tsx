import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { IconFile } from "@tabler/icons-react";
import {
  Image,
  Text,
  Group,
  Badge,
  Box,
  Card,
  CardSection,
  Divider,
  Center,
  Container,
  Title,
  List,
  ListItem,
  ThemeIcon,
} from "@mantine/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./styles.css";
import {
  Captions,
  Download,
  Fullscreen,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface Post {
  id: number;
  postTime: string;
  title: string;
  status: string | null;
  username: string;
  subjectCode: string;
  test: boolean;
  content: string;
  filenames: string[];
}

interface ImageItem {
  src: string;
  title: string;
  description: string | null;
}

const LearningMaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response: AxiosResponse<Post> = await axios.get(
          `http://localhost:8080/api/v1/learningMaterial/getById?id=${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchFileLinks = async () => {
      if (post && post.filenames.length > 0) {
        const urls: { [key: string]: string } = {};
        for (const file of post.filenames) {
          const response = await fetch(
            `http://localhost:8080/api/v1/learningMaterial/getFile?id=${id}&filename=${file}`
          );
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          urls[file] = url;
        }
        setFileUrls(urls);
      }
    };

    fetchFileLinks();
  }, [post, id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleDownloadOldFile = async (filename: string) => {
    const url = await fetchFileLink(filename);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
  };

  const fetchFileLink = async (filename: string): Promise<string> => {
    const response = await fetch(
      `http://localhost:8080/api/v1/learningMaterial/getFile?id=${id}&filename=${filename}`
    );
    const file = await response.blob();

    const url = window.URL.createObjectURL(new Blob([file]));
    return url;
  };

  // Initialize empty lists for images and other files
  const imageList: ImageItem[] = [];
  const fileList: string[] = [];

  // Iterate over filenames and categorize them
  post.filenames.forEach((file, index) => {
    const url = fileUrls[file];
    const isImage =
      url &&
      (file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".png") ||
        file.endsWith(".gif"));

    if (isImage) {
      imageList.push({
        src: url,
        title: file,
        description: null,
      });
    } else {
      fileList.push(file);
    }
  });

  return (
    <Center>
      <Container size={"xl"} mt={"xl"}>
        <Card withBorder shadow="sm" padding="xl">
          <CardSection>
            <Title order={2} ta={"center"} component="div" mb={2} p={"md"}>
              {post.title}
            </Title>
          </CardSection>
          <Divider size="xs" />
          <Group justify="space-between">
            <Text fw={700} size="lg">
              {post.username}
            </Text>
            <Text c="dimmed" p={"md"}>
              {format(new Date(post.postTime), "dd/MM/yyyy HH:mm")}
            </Text>
          </Group>
          <CardSection>
            <Box w={600}>
              <Text fw={400} size="lg" mt="md" p={"lg"}>
                <ReactQuill
                  value={post.content}
                  readOnly={true}
                  theme="bubble"
                />
              </Text>

              <div className="images-container">
                {imageList.map((image, idx) => (
                  <div
                    key={idx}
                    className="image"
                    onClick={() => setIndex(idx)}
                  >
                    <img src={image.src} alt={image.title} />
                  </div>
                ))}
              </div>

              <Lightbox
                plugins={[Captions, Download, Fullscreen, Zoom, Thumbnails]}
                captions={{
                  showToggle: true,
                  descriptionTextAlign: "end",
                }}
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={imageList}
              />
            </Box>
          </CardSection>
          <Divider my="sm" variant="dotted" />

          <Group justify="space-between">
            {post.test ? (
              <Badge color="indigo">Mock Test</Badge>
            ) : (
              <Badge color="pink">Learning material</Badge>
            )}

            <Box>
              <Text variant="body2" ml={1}>
                Love
              </Text>
              <Text variant="body2" ml={1}>
                Comment
              </Text>
              <Text variant="body2" ml={1}>
                Share
              </Text>
            </Box>
          </Group>
          <Text mt="xs" c="dimmed" size="sm"></Text>
        </Card>
      </Container>
    </Center>
  );
};

export default LearningMaterialDetail;
