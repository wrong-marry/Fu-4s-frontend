import React, {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {
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
} from "@mantine/core";

import {format} from "date-fns";
import {useParams} from "react-router-dom";

interface Post {
    id: number;
    postTime: string;
    title: string;
    status: string | null;
    username: string;
    subjectCode: string;
    test: boolean;
    content: string;
}

const MockTestDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();

    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response: AxiosResponse<Post> = await axios.get(
                    `http://3.27.235.175:8080/api/v1/questionSet/?id=${id}`
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

    return (
        <Center>
            <Container size={"xl"} mt={"xl"}>
                <Card withBorder shadow="sm" padding="xl">
                    <CardSection>
                        <Title order={2} ta={"center"} component="div" mb={2} p={"md"}>
                            {post.title}
                        </Title>
                    </CardSection>
                    <Divider size="xs"/>
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
                                {post.content}
                            </Text>
                        </Box>
                    </CardSection>
                    <Divider my="sm" variant="dotted"/>

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

export default MockTestDetail;
