import {Params, redirect, useActionData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {Grid, Skeleton, Container, Flex, TextInput, NativeSelect} from '@mantine/core';
import { toast } from "react-toastify";
import {Avatar, Badge, Card, Group, Stack, Text} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import classes from "../../component/home/Carousel.module.css";
import '@mantine/dates/styles.css';
import { Radio} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';
import {DateInput} from "@mantine/dates";

function searchDrawer() {
    const [opened, { open, close }] = useDisclosure(false);
    const [value, setValue] = useState<Date | null>();
    return (
        <>
            <Drawer
                size={"xs"}
                opened={opened}
                onClose={close}
                title="Advanced search options"
                overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
            >
                <TextInput
                    label="Title"
                    placeholder="Keyword for title"
                    description="The title must contains this keyword"
                />

                <NativeSelect
                    mt="md"
                    label="Subject"
                    data={['Any subject','DBI202', 'SWP391', 'PRJ301', 'PRN202']}
                    description="Pick a subject code"
                />

                <DateInput
                    mt="md"
                    value={value}
                    onChange={setValue}
                    valueFormat="YYYY MMM DD"
                    label="Date"
                    description="Only find posts after"
                    placeholder="Upload time"
                />

                <Radio.Group
                    mt="md"
                    name="isTest"
                    label="Post type"
                    description="Choose the desired type of post"
                >
                    <Group mt="xs">
                        <Radio label="All" value="null"/>
                        <Radio value="true" label="Mock test" />
                        <Radio value="false" label="Learning material" />
                    </Group>
                </Radio.Group>
                <Button mt={"xl"} ml={"30%"} onClick={()=>window.location.replace("/search")}>
                    Search
                </Button>
            </Drawer>
            <Flex justify={"space-around"} align={"center"}>
                <Text>Showing 1000 results.</Text>

                <Text fz={12} opacity={0.6} ta={"center"}>
                    <div>
                        Did not find the post?
                    </div>
                    <div>
                        <Button onClick={open} m={"auto"}>
                            Advanced search
                        </Button>
                    </div>
                </Text>
            </Flex>
        </>
    );
}

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
        <Container my="lg" size={"lg"}>
            <Text ta={"center"} fw={650} fz={25}>Search result</Text>
            {searchDrawer()}
            <Text lh={3} ta={"center"}>______</Text>
            <Text lh={2} fw={650} fz={25}>Learning material</Text>
            {resData?.learningMaterials.length === 0 ? (
                <Text c={"dimmed"}>No learning material found :(</Text>
            ) : (
                <Card display={"flex"}><Card.Section>
                <Carousel
                    slideSize={"33.333333%"}
                    height={"180px"}
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
                                        <Text fw={500} truncate="end">{test.title}</Text>
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
                </Carousel>
                </Card.Section></Card>
            )}


                <Text lh={2} fw={650} fz={25}>Mock test</Text>
            {resData?.tests.length === 0 ? (
                <Text c={"dimmed"}>No mock tests found :(</Text>
            ) : (
                <Card><Card.Section>
                <Carousel
                    slideSize={"33.333333%"}
                    height={"180px"}
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
                                        <Text fw={500} truncate="end">{test.title}</Text>
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
        </Container>
    );
}
export default SearchPage;
