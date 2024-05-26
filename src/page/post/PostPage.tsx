import { Post } from "../search/SearchPage";
import { Card, Image, Text, Group, RingProgress, Badge } from "@mantine/core";
import classes from "./CardWithStats.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface PostData {
  id: string;
  title: string;
  username: string;
  postTime: Date;
  subjectCode: string;
  isTest: boolean;
}

export function CardWithStats() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PostData | null>(null);

  useEffect(() => {
    async function fetchPost(id: string) {
      const response = await axios.get<PostData>(
        `http://localhost:8080/api/v1/post/get?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response.data);
    }
    if (!data) {
      fetchPost(id!);
    }
  }, [id, data]);

  const footerItems = data ? (
    <>
      <div key="Post">
        <Text size="xs" color="dimmed">
          Uploader
        </Text>
        <Text fw={500} size="sm">
          {data.username}
        </Text>
      </div>
      <div key="Time">
        <Text size="xs" color="dimmed">
          Post time
        </Text>
        <Text fw={500} size="sm">
          {data.postTime.toISOString().substring(0, 10)}
        </Text>
      </div>
      <div key="Subject">
        <Text size="xs" color="dimmed">
          Subject
        </Text>
        <Text fw={500} size="sm">
          {data.subjectCode}
        </Text>
      </div>
    </>
  ) : (
    <div>No data</div>
  );

  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Card.Section>
        <Image
          src="https://cdn.shortpixel.ai/spai/w_600+q_lossy+ret_img+to_webp/thesocialmediamonthly.com/wp-content/uploads/2018/01/quiz.jpg"
          alt="QuizPlash"
          height={30}
        />
      </Card.Section>

      <Group justify="space-between" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
          {data?.title}
        </Text>
        <Group gap={5}>
          <Text fz="xs" c="dimmed">
            80% completed
          </Text>
          <RingProgress
            size={18}
            thickness={2}
            sections={[{ value: 80, color: "blue" }]}
          />
        </Group>
        {data?.isTest ? (
          <Badge color="indigo">Mock Test</Badge>
        ) : (
          <Badge color="pink">Learning material</Badge>
        )}
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        56 km this month • 17% improvement compared to last month • 443 place in
        global scoreboard
      </Text>
      <Card.Section className={classes.footer}>{footerItems}</Card.Section>
    </Card>
  );
}

export default function PostPage() {
  return (
    <Card>
      <CardWithStats />
    </Card>
  );
}
