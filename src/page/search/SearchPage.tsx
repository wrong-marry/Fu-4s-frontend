import {Params, redirect, useActionData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import { Grid, Skeleton, Container } from '@mantine/core';
import { toast } from "react-toastify";
import {Avatar, Badge, Card, Group, Stack, Text} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import classes from "../../component/home/Carousel.module.css";
export interface Post {
    id: number;
    postTime: Date;
    content: string;
    title: string;
    subjectCode: string;
    username: string;
    isTest: boolean;
}
interface ResponseData {
    learningMaterials: Post[];
    tests: Post[];
}
export async function fetchPostData(keyword: string) {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/v1/search?keyword=${keyword}`
        );
        return response.data;
    } catch (error) {
        throw new Error("Error fetching post data");
    }
}
function SearchPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [resData, setResData] = useState<ResponseData>();
    const fetchData = async () => {
        const data = await fetchPostData(searchParams.get("keyword")+"");
        setResData  ({
            learningMaterials: data?.data?.learningMaterials,
            tests: data?.data?.tests,
        });
    };
    fetchData();
    return (
        <Container my="md">
            <Grid>
            <Text>Learning material</Text>
            {resData?.learningMaterials.length === 0 ? (
                <Text c={"dimmed"}>No learning material found :(</Text>
            ) : (
                <Card><Card.Section>
                <Carousel
                    slideSize={"33.333333%"}
                    height={"150px"}
                    align={"start"}
                    slideGap="lg"
                    controlsOffset="xs"
                    controlSize={30}
                    dragFree
                    classNames={classes}
                >
                    {resData?.learningMaterials?.map((test, index) => (
                        <Carousel.Slide key={index}>
                            <Card
                                shadow="sm"
                                radius="md"
                                padding={"lg"}
                                withBorder
                                component="a"
                                className="h-full"
                            >
                                <Stack
                                    onClick={() => {
                                        navigate(`/post/${test.id}`);
                                    }}
                                    className="cursor-pointer justify-between h-full"
                                >
                                    <Stack gap={2}>
                                        <Text fw={500}>{test.title}</Text>
                                        <Text fw={150} fz={13}>{test.postTime
                                            .toString().substring(0,10)
                                        }
                                        </Text>
                                        {
                                            (test.isTest)?
                                                <Badge color="indigo">
                                                    Mock Test
                                                </Badge> :
                                                <Badge color="pink">
                                                    Learning Material
                                                </Badge>
                                        }
                                    </Stack>
                                    <Group gap={"xs"}>
                                        <Avatar variant="filled" radius="xl" size="sm" />
                                        <Text size="sm">{test.username}</Text>
                                        <Stack gap={2}>
                                            <Badge color="blue">
                                                {test.subjectCode}
                                            </Badge>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </Card>
                        </Carousel.Slide>
                    ))}
                </Carousel></Card.Section></Card>
            )}


                <Text lh={2}>Mock test</Text>
            {resData?.tests.length === 0 ? (
                <Text c={"dimmed"}>No mock tests found :(</Text>
            ) : (
                <Card><Card.Section>
                <Carousel
                    slideSize={"33.333333%"}
                    height={"150px"}
                    align={"start"}
                    slideGap="lg"
                    controlsOffset="xs"
                    controlSize={30}
                    dragFree
                    classNames={classes}
                >
                    {resData?.tests?.map((test, index) => (
                        <Carousel.Slide key={index}>
                            <Card
                                shadow="sm"
                                radius="md"
                                padding={"lg"}
                                withBorder
                                component="a"
                                className="h-full"
                            >
                                <Stack
                                    onClick={() => {
                                        navigate(`/post/${test.id}`);
                                    }}
                                    className="cursor-pointer justify-between h-full"
                                >
                                    <Stack gap={2}>
                                        <Text fw={500}>{test.title}</Text>
                                        <Text fw={150} fz={13}>{test.postTime
                                            .toString().substring(0,10)
                                        }
                                        </Text>
                                        {
                                                <Badge color="indigo">
                                                    Mock Test
                                                </Badge>
                                        }
                                    </Stack>
                                    <Group gap={"xs"}>
                                        <Avatar variant="filled" radius="xl" size="sm" />
                                        <Text size="sm">{test.username}</Text>
                                        <Stack gap={2}>
                                            <Badge color="blue">
                                                {test.subjectCode}
                                            </Badge>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </Card>
                        </Carousel.Slide>
                    ))}
                </Carousel></Card.Section></Card>
            )}
            </Grid>
        </Container>
    );
}
export default SearchPage;
