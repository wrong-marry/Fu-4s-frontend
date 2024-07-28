import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {
    Text,
    Container,
    Title,
    Space,
    Textarea,
    Button,
    Anchor,
    Modal,
    Group,
    Center, rem, Select, Flex,
} from "@mantine/core";
import {IconAdjustmentsAlt, IconChevronsRight} from "@tabler/icons-react";

import {Comment} from "../../component/comment/CommentTag";
import {useParams} from "react-router-dom";
import MockTestDetailPage from "../mock-test-detail-page/MockTestDetailPage";
import {forEach} from "lodash";
import {useForm} from "@mantine/form";
import LearningMaterialDetail from "../../component/user-post/learning-material/LearningMaterialDetail";
import {useDisclosure} from "@mantine/hooks";
import {BASE_URL} from "../../common/constant.tsx";
import {Subject} from "../list/PostListBySubject.tsx";
import {fetchAuthorUsername} from "../../util/loader/PostUtils.tsx";
import PostsOfAuthor from "../../component/user-post/PostsOfAuthor.tsx";
import PostsOfSubject from "../../component/user-post/PostsOfSubject.tsx";
import {loadingIndicator} from "../../App.tsx";
import {ErrorPage} from "../404/ErrorPage.tsx";

export interface Post {
    id: number;
    postTime: string;
    title: string;
    status: string | null;
    username: string;
    subjectCode: string;
    test: boolean;
}

export interface CommentData {
    id: number;
    date: Date;
    account: string;
    username: string;
    content: string;
    status: string;
    isMine: boolean;
    childrenNumber: number;
}

const PostPage = () => {
    const {id} = useParams<{ id: string }>();
    const [opened, toggle] = useDisclosure(false);
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: localStorage.getItem("username"),
            content: "",
        },
        validate: {
            content: (value: string) =>
                /^\S/.test(value) ? null : "Invalid content",
        },
    });

    const [outOfComment, setOutOfComment] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<CommentData[] | null>([]);
    const [authorname, setAuthorname] = useState<string | null>(null);
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sorted, setSorted] = useState(false);
    const isStaff = ["STAFF", "ADMIN"].includes(
        localStorage.getItem("role") + ""
    );
    const fetchPost = async () => {
        const response: Post = (
            await axios.get(`${BASE_URL}/api/v1/post/get?id=${id}`))
            .data;
        setPost(response);
        if (response.id == null) throw new Error("Post not found");
    };

    // const fetchAuthorname = async () => {
    // 	const response: string = (
    // 		await axios.get(`${BASE_URL}/api/v1/post/getUsernameById?id=${id}`)
    // 	).data;
    // 	setAuthorname(response);
    // };

    const fetchComments = async (sorted: boolean) => {
        try {
            const response: AxiosResponse<CommentData[]> = await axios.get(
                `${BASE_URL}/api/v1/comments/post/${id}` +
                (isStaff ? "?isStaff=true&" : "?") + (sorted ? "sorted" : ""),
                {
                    headers: {
                        // Check login
                        Authorization:
                            localStorage.getItem("username") !== null
                                ? `Bearer ${localStorage.getItem("token")}`
                                : "",
                    },
                }
            );
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comment:", error);
        }
    };
    const fetchMore = async () => {
        try {
            const api =
                `${BASE_URL}/api/v1/comments/post/${id}` +
                (isStaff ? `?isStaff=true&` : `?`) +
                `offset=` +
                (comments?.length ?? 0);
            const response: AxiosResponse<CommentData[]> = await axios.get(api, {
                headers: {
                    Authorization:
                        localStorage.getItem("username") !== null
                            ? `Bearer ${localStorage.getItem("token")}`
                            : "",
                },
            });
            setComments((comment) => comment?.concat(response.data) || []);
            if (response.data.length < 10) setOutOfComment(true);
        } catch (error) {
            console.error("Error fetching comment:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPost();
            await fetchComments(sorted);

            if (post?.subjectCode) {
                await fetchSubject(post.subjectCode);
            }

            const authorname = await fetchAuthorUsername(post?.id + "");
            setAuthorname(authorname);
        };

        fetchData().catch(() => {
            // navigate("/404");
            return;
        }).finally(() => setLoading(false));
    }, [id, post?.subjectCode, sorted]);

    const fetchSubject = async (subjectCode: string) => {
        const response: Subject = (
            await axios.get(`${BASE_URL}/api/v1/subject/${subjectCode}`)
        ).data;
        setSubject(response);
    };

    function updateCommentWithId(id: number, content: string) {
        setComments(
            (comments) =>
                comments &&
                comments.map((comment) =>
                    comment.id === id ? {...comment, content: content} : comment
                )
        );
    }

    return (
        loading ? loadingIndicator :
            (post?.title == null ? <ErrorPage/> :
                    <>
                        <Modal opened={opened} onClose={toggle.close} title={"Login required"}>
                            <Text ta={"center"}>You did not login!</Text>
                            <Group justify={"space-around"} mt={"md"}>
                                <Button
                                    size={"sm"}
                                    onClick={() => (window.location.href = "/auth/login")}
                                >
                                    Login
                                </Button>
                                <Button color={"red"} size={"sm"} onClick={toggle.close}>
                                    Close
                                </Button>
                            </Group>
                        </Modal>

                        <Container>
                            <Center style={{display: "flex", gap: "10px"}}>
                                <Anchor href="/">FU4S</Anchor> <IconChevronsRight size={20}/>
                                <Anchor href={`/semester/${subject?.semester ?? ""}`}>
                                    Semester {subject?.semester}
                                </Anchor>{" "}
                                <IconChevronsRight size={20}/>
                                <Anchor href={`/subject/${post?.subjectCode ?? ""}`}>
                                    {post?.subjectCode ?? ""}
                                </Anchor>
                            </Center>
                            {!post?.test && <LearningMaterialDetail {...post} />}
                            {post?.test && <MockTestDetailPage {...post} />}

                            {post?.username && (
                                <>
                                    <Space h={"xl"}/>
                                    <Title order={3}>
                                        Posts of{" "}
                                        <Anchor fw={700} size="xl" href={`/user/${authorname}`}>
                                            {post?.username}
                                        </Anchor>
                                    </Title>
                                    <PostsOfAuthor authorname={authorname ?? ""}/>
                                </>
                            )}
                            {post?.subjectCode && (
                                <>
                                    <Space h={"xl"}/>
                                    <Title order={3}>
                                        Posts in{" "}
                                        <Anchor fw={700} size="xl" href={`/subject/${post.subjectCode}`}>
                                            {post.subjectCode}
                                        </Anchor>
                                    </Title>
                                    <PostsOfSubject thisSubject={post.subjectCode}/>
                                </>
                            )}

                            <Space h={"xl"}/>
                            <Flex justify={"space-between"}>
                                <Title order={2}>Comment section</Title>
                                <Select
                                    onChange={(value) => setSorted(value == "sorted")}
                                    leftSection={
                                        <IconAdjustmentsAlt
                                            style={{width: rem(18), height: rem(18)}}
                                            stroke={1.5}
                                        />
                                    }
                                    placeholder="Order"
                                    data={[
                                        {
                                            group: "Sort by",
                                            items: [
                                                {label: "Oldest first", value: "default"},
                                                {label: "Newest first", value: "sorted"},
                                            ],
                                        },
                                    ]}
                                />
                            </Flex>
                            {comments == null || comments?.length == 0 ? (
                                <Text>No comments</Text>
                            ) : (
                                <></>
                            )}
                            {forEach(comments)?.map((c) => (
                                <Comment
                                    key={c.id}
                                    id={c.id}
                                    username={c.username}
                                    content={c.content}
                                    date={c.date}
                                    isMine={c.account == localStorage.getItem("username")}
                                    account={c.account}
                                    status={c.status}
                                    childrenNumber={c.childrenNumber}
                                    updateFunction={updateCommentWithId}
                                />
                            ))}
                            {!(
                                (comments?.length ?? 0) % 10 ||
                                (comments?.length ?? 0) == 0 ||
                                outOfComment
                            ) ? (
                                <Anchor onClick={fetchMore}>Load more comments</Anchor>
                            ) : (
                                <></>
                            )}
                            {
                                post.status == "ACTIVE" &&
                                <form
                                    onSubmit={form.onSubmit(async (values) => {
                                        if (localStorage.getItem("username") == null) {
                                            toggle.open();
                                            return;
                                        }
                                        try {
                                            const response: AxiosResponse<{ message: string; id: number }> =
                                                await axios.post(
                                                    `${BASE_URL}/api/v1/comments/upload/post-${id}`,
                                                    values,
                                                    {
                                                        headers: {
                                                            Authorization:
                                                                "Bearer " + localStorage.getItem("token"),
                                                        },
                                                    }
                                                );

                                            if (response.status == 200) {
                                                setComments(
                                                    (comments) =>
                                                        comments?.concat([
                                                            {
                                                                status: "ACTIVE",
                                                                content: values.content,
                                                                date: new Date(),
                                                                username: "Me",
                                                                account: localStorage.getItem("username") || "",
                                                                isMine: true,
                                                                id: response.data?.id ?? -1,
                                                                childrenNumber: 0,
                                                            },
                                                        ]) || []
                                                );
                                                form.reset();
                                            }
                                        } catch (error: any) {
                                            if (error.response?.status == 401) {
                                                toggle.open();
                                            } else {
                                                console.error("Error posting comment:", error);
                                            }
                                        }
                                    })}
                                >
                                    <Textarea
                                        size={"md"}
                                        my={"md"}
                                        placeholder={"Your comment"}
                                        autosize
                                        minRows={2}
                                        maxRows={4}
                                        key={form.key("content")}
                                        {...form.getInputProps("content")}
                                    ></Textarea>
                                    <Button type={"submit"}>Comment</Button>
                                </form>
                            }
                        </Container>
                    </>
            ));
};

export default PostPage;
