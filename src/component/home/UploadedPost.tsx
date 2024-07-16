import {Carousel} from "@mantine/carousel";
import {Card, Text, Badge, Group, Stack, Avatar, Flex, ActionIcon} from "@mantine/core";
import axios from "axios";
import React, {useEffect, useState} from "react";
import classes from "./Carousel.module.css";
import {useNavigate} from "react-router-dom";
import {Post} from "./RecentPost"
import {IconDots} from "@tabler/icons-react";
import {BASE_URL} from "../../common/constant.tsx";

function UploadedPost() {

    const [uploadedPost, setUploadedPost] = useState<Post[]>([]);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    useEffect(() => {
        axios
            .get(`${BASE_URL}/api/v1/post/getAllByUsername?username=${username}&pageSize=6&pageNum=1`)
            .then((res) => {
                const sortedList =
                    res && res.data
                        ? res.data.sort(
                            (
                                a: { date: string | number | Date },
                                b: { date: string | number | Date }
                            ) => {
                                const timeA = new Date(a.date).getTime();
                                const timeB = new Date(b.date).getTime();
                                return timeB - timeA; // Sort in descending order for most completed views first
                            }
                        )
                        : [];
                setUploadedPost(sortedList);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Handle error gracefully, e.g., display an error message to the user
            });
    }, []);

    function fetchMore(pageNum: number) {
        axios
            .get(`${BASE_URL}/api/v1/post/getAllByUsername?username=${username}&pageSize=6&pageNum=${pageNum}`)
            .then((res) => {
                const sortedList =
                    res && res.data
                        ? res.data.sort(
                            (
                                a: { date: string | number | Date },
                                b: { date: string | number | Date }
                            ) => {
                                const timeA = new Date(a.date).getTime();
                                const timeB = new Date(b.date).getTime();
                                return timeB - timeA; // Sort in descending order for most completed views first
                            }
                        )
                        : [];
                setUploadedPost(list => list.concat(sortedList));
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Handle error gracefully, e.g., display an error message to the user
            });
    }

    return (
        <>
            {uploadedPost.length === 0 ? (
                <Text c={"dimmed"}>No completed tests available :(</Text>
            ) : (
                <Carousel
                    slideSize={"25%"}
                    height={"150px"}
                    align={"start"}
                    slideGap="md"
                    controlsOffset="xs"
                    controlSize={30}
                    dragFree
                    classNames={classes}
                >
                    {uploadedPost?.map((test, index) => (
                        <Carousel.Slide key={index}>
                            <Card
                                miw={"300px"}
                                maw={"300px"}
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
                                        <Text fw={360} truncate="end">{test.title}</Text>
                                        <Text fw={200} fz={12}>{test.postTime.toString().substring(0, 10)}</Text>
                                        {test.test ? (
                                            <Badge color="indigo">Mock Test</Badge>
                                        ) : (
                                            <Badge color="pink">Learning Material</Badge>
                                        )}
                                    </Stack>
                                    <Group align="stretch" gap="sm" style={{marginBottom: '10px'}}>
                                        <Avatar
                                            variant="filled"
                                            radius="xl"
                                            size="sm"
                                            style={{
                                                height: '110%',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                width: '10%'
                                            }}
                                        />
                                        <Text size="sm">Me</Text>
                                        <Stack gap={2}>
                                            <Badge
                                                color="blue"
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '1px 8px',
                                                    borderRadius: '999px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    textTransform: 'uppercase',
                                                    width: '100%'
                                                }}
                                            >
                                                {test.subjectCode}
                                            </Badge>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </Card>
                        </Carousel.Slide>
                    ))}
                    {uploadedPost.length && <Carousel.Slide> <Flex
                        p={"lg"}
                        className="h-full"
                        align={"center"}
                    >
                        <ActionIcon variant="default" aria-label="Dots"
                                    radius={"xl"} size={"xl"} onClick={() => fetchMore((uploadedPost.length + 1) / 6)}>
                            <IconDots stroke={1.5}/>
                        </ActionIcon></Flex></Carousel.Slide>}
                </Carousel>
            )}
        </>
    ) as React.ReactElement;
}

export default UploadedPost;
