import {Params, redirect, useActionData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {Grid, Skeleton, Container, Flex, TextInput, NativeSelect, Pagination, Center} from '@mantine/core';
import { toast } from "react-toastify";
import {Avatar, Badge, Card, Group, Stack, Text} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import classes from "../../component/home/Carousel.module.css";
import '@mantine/dates/styles.css';
import { Radio} from '@mantine/core';
import {IconAdjustmentsAlt, IconSettings} from '@tabler/icons-react';
import { Select, rem } from '@mantine/core';

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

                <TextInput
                    mt={"md"}
                    type={"number"}
                    label="Semester"
                    placeholder="Semester"
                    description="Try entering the semester you are in"
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
                <Select
                    leftSection={<IconAdjustmentsAlt style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                    placeholder="Sort by"
                    data={[
                        { group: 'Recency', items: ['Newest first', 'Oldest first'] },
                        { group: 'Alphabet', items: ['A-Z', 'Z-A'] },
                    ]}
                />
                <Text ta={"center"}>
                    <Text  opacity={0.6} fz={12} >
                        Did not find the post?
                    </Text>
                    <div>
                        <Button onClick={open} m={"auto"} opacity={2}>
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
    test: boolean;
}
interface ResponseMaterialData {
    totalMaterial: number;
    learningMaterials: Post[];
}
interface ResponseTestData {
    totalTest: number;
    tests: Post[];
}
export const POST_PAGE_SIZE = 10;
interface SearchRequest {
    username: string|null;
    title: string|null;
    subjectCode: string|null;
    postTime: string|null;
    isTest: boolean|null;
    order: string;
    pageSize: number;
    currentPage: number;

}
enum SearchOrder {
    USERNAME_ASC, USERNAME_DESC, TITLE_ASC, TITLE_DESC, DATE_ASC, DATE_DESC
}
export async function advancedSearch(searchRequest: SearchRequest) {
    try {
        let api = `http://localhost:8080/api/v1/search?pageSize=`+POST_PAGE_SIZE;
        if (searchRequest.username) api+=`&username=${searchRequest.username}`;
        if (searchRequest.title) api+=`&keyword=${searchRequest.title}`;
        if (searchRequest.isTest!=null) api+=`&isTest=${searchRequest.isTest}`;
        api+=`&order=${searchRequest.order}`;

        api+=`&page=${searchRequest.currentPage}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        throw new Error("Error fetching post data");
    }
}
function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [resMaterialData, setResMaterialData] = useState<ResponseMaterialData>();
    const [resTestData, setResTestData] = useState<ResponseTestData>();
    const [currentMaterialPage, setCurrentMaterialPage] = useState<number>(1);
    const [currentTestPage, setCurrentTestPage] = useState<number>(1);
    const advancedFetchData = async (searchReq:SearchRequest) => {
        const data = await advancedSearch(searchReq);
        if (data?.data?.learningMaterials)
        setResMaterialData  ({
            totalMaterial: data?.data?.totalMaterial,
            learningMaterials: data?.data?.learningMaterials,
        });
        if (data?.data?.tests)
        setResTestData  ({
            totalTest:data?.data?.totalTest,
            tests: data?.data?.tests,
        });
    };
    const [searchRequest, setSearchRequest] = useState({
        username: null,
        title: searchParams.get("keyword"),
        subjectCode: null,
        postTime: null,
        isTest: null,
        order: SearchOrder[SearchOrder.DATE_DESC],
        pageSize: POST_PAGE_SIZE,
        currentPage: 1,
    });
    useEffect(() => {
        advancedFetchData(searchRequest);
    }, [searchRequest]);

    const numberOfMaterialPages = (resMaterialData?.totalMaterial==0||resMaterialData?.totalMaterial==undefined)
            ?0:(Math.ceil(resMaterialData.totalMaterial/POST_PAGE_SIZE));
    const numberOfTestPages = (resTestData?.totalTest==0||resTestData?.totalTest==undefined)
        ?0:(Math.ceil(resTestData.totalTest/POST_PAGE_SIZE));
    return (
        <Container my="lg" size={"lg"}>
            <Text ta={"center"} fw={650} fz={25}>Search result</Text>
            {searchDrawer()}
            <Text lh={3} ta={"center"}>______</Text>

            {
                (resTestData==null)?
                    <></> :
                (resMaterialData==null)?
                    <></> :
                    <>
                        <Text lh={2} fw={650} fz={25}>Learning material</Text>
                        {(resMaterialData?.learningMaterials.length === 0) ?
                            <Text c={"dimmed"}>No learning material found</Text>
                            :
                            MyPostList(resMaterialData.learningMaterials)}
                    </>
            }
            <Center>
                <Pagination
                    mt={"lg"}
                    value={currentMaterialPage}
                    total={numberOfMaterialPages}
                    getItemProps={(page) => ({
                        onClick: () => {
                            setCurrentMaterialPage(page);
                            setSearchRequest({ ...searchRequest, currentPage: page, isTest: false });
                        }
                    })}
                    getControlProps={(control) => {
                        if (control === 'first') {
                            return { onClick: () => {
                                    setCurrentMaterialPage(1);
                                    setSearchRequest({ ...searchRequest, currentPage: 1, isTest: false });
                                } };
                        }

                        if (control === 'last') {
                            return { onClick: () => {
                                    setCurrentMaterialPage(numberOfMaterialPages);
                                    setSearchRequest({ ...searchRequest, currenPage: numberOfMaterialPages, isTest: false });
                                } };
                        }

                        if (control === 'next') {
                            return { onClick: () => {
                                    setCurrentMaterialPage(currentMaterialPage+1);
                                    setSearchRequest({ ...searchRequest, currentPage: currentMaterialPage, isTest: false });
                                } };
                        }

                        if (control === 'previous') {
                            return { onClick: () => {
                                    setCurrentMaterialPage(currentMaterialPage-1);
                                    setSearchRequest({ ...searchRequest, currentPage: currentMaterialPage, isTest: false });
                                } };
                        }

                        return {};
                    }}
                />
            </Center>
            {
                (resTestData==null)?
                   <></> :
                    <>
                        <Text lh={2} fw={650} fz={25}>Mock test</Text>
                        {(resTestData?.tests.length === 0) ?
                        <Text c={"dimmed"}>No mock tests found</Text>
                        :
                        MyPostList(resTestData.tests)}
                    </>
            }
            <Center>
                <Pagination
                    mt={"lg"}
                    value={currentTestPage}
                    total={numberOfTestPages}
                    getItemProps={(page) => ({
                        onClick: () => {
                            setCurrentTestPage(page);
                            setSearchRequest({ ...searchRequest, currentPage: page, isTest: true });
                        }
                    })}
                    getControlProps={(control) => {
                        if (control === 'first') {
                            return { onClick: () => {
                                    setCurrentTestPage(1);
                                    setSearchRequest({ ...searchRequest, currentPage: 1, isTest: true });
                                } };
                        }

                        if (control === 'last') {
                            return { onClick: () => {
                                    setCurrentTestPage(numberOfTestPages);
                                    setSearchRequest({ ...searchRequest, currenPage: numberOfTestPages, isTest: true });
                                } };
                        }

                        if (control === 'next') {
                            return { onClick: () => {
                                    setCurrentTestPage(currentTestPage+1);
                                    setSearchRequest({ ...searchRequest, currentPage: currentTestPage, isTest: true });
                                } };
                        }

                        if (control === 'previous') {
                            return { onClick: () => {
                                    setCurrentTestPage(currentTestPage-1);
                                    setSearchRequest({ ...searchRequest, currentPage: currentTestPage, isTest: false });
                                } };
                        }

                        return {};
                    }}
                />
            </Center>
        </Container>
    );
}
export function MyPostList(resData:Post[]) {
    return <>
        <Card>
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
                {resData?.map((test, index) => (
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
                                        (test.test)?
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
        </Card>
        </>;
}
export default SearchPage;
