import React, {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {Text, Container, Title, Space, Textarea, Button, Anchor, Modal, Group} from "@mantine/core";

import {Comment} from "../../component/comment/CommentTag";
import {useParams} from "react-router-dom";
import MockTestDetailPage from "../mock-test-detail-page/MockTestDetailPage";
import {forEach} from "lodash";
import {useForm} from "@mantine/form";
import LearningMaterialDetail from "../../component/user-post/learning-material/LearningMaterialDetail";
import {useDisclosure} from "@mantine/hooks";

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

const PostPage: React.FC = () => {
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

    const isStaff = ["STAFF", "ADMIN"].includes(
        localStorage.getItem("role") + ""
    );
    const fetchPost = async () => {
        const response: Post = (await axios.get(
            `http://3.27.235.175:8080/api/v1/post/get?id=${id}`
        )).data;
        setPost(response);
        console.log("1" + post);
    };
    const fetchComments = async () => {
        try {
            const response: AxiosResponse<CommentData[]> = await axios.get(
                `http://3.27.235.175:8080/api/v1/comments/post/${id}` + (isStaff ? "?isStaff=true" : ""), {
                    headers: {
                        // Check login
                        Authorization: localStorage.getItem("username") !== null ? `Bearer ${localStorage.getItem("token")}` : ""
                    }
                }
            )
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comment:", error);
        }
    };
    const fetchMore = async () => {
        try {
            const api = `http://3.27.235.175:8080/api/v1/comments/post/${id}` + (isStaff ? `?isStaff=true&` : `?`) +
                `offset=` + (comments?.length ?? 0);
            const response: AxiosResponse<CommentData[]> = await axios.get(api, {
                headers: {
                    Authorization: localStorage.getItem("username") !== null ? `Bearer ${localStorage.getItem("token")}` : "",
                }
            });
            console.log(response.data);
            setComments(comment =>
                comment?.concat(response.data) || []
            );
            if (response.data.length < 10) setOutOfComment(true);
        } catch (error) {
            console.error("Error fetching comment:", error);
        }
    };

    useEffect(() => {
        fetchPost().then(
            () => console.log(post)
        ).finally(() => {
        });
        fetchComments().catch();
    }, [id]);

    function updateCommentWithId(id: number, content: string) {
        setComments(
            comments => comments && comments.map(
                comment => comment.id === id ? {...comment, content: content} : comment
            )
        );
    }

    return <>
        <Modal opened={opened} onClose={toggle.close} title={"Login required"}>
            <Text ta={"center"}>You did not login!</Text>
            <Group justify={"space-around"} mt={"md"}>
                <Button size={"sm"} onClick={() => window.location.href = "/auth/login"}>Login</Button>
                <Button color={"red"} size={"sm"} onClick={toggle.close}>Close</Button>
            </Group>
        </Modal>
        {!post?.test && <LearningMaterialDetail/>}
        {post?.test && <MockTestDetailPage {...post} />}
        <Space h={"md"}/>
        <Container>
            <Title order={2}>Comment section</Title>
            {(comments == null || comments?.length == 0) ? <Text>No comments</Text> : <></>}
            {forEach(comments)?.map(
                c => <Comment key={c.id} id={c.id} username={c.username} content={c.content} date={c.date}
                              isMine={c.account == localStorage.getItem("username")}
                              account={c.account} status={c.status} childrenNumber={c.childrenNumber}
                              updateFunction={updateCommentWithId}
                />
            )}
            {/*Check if there is more comment to fetch*/}
            {!((comments?.length ?? 0) % 10 || (comments?.length ?? 0) == 0 || outOfComment) ?
                <Anchor onClick={fetchMore}>Load more comments</Anchor> : <></>}
            <form
                onSubmit={form.onSubmit(async (values) => {
                    console.log(values);
                    try {
                        const response: AxiosResponse<{ message: string, id: number }> = await axios.post(
                            `http://3.27.235.175:8080/api/v1/comments/upload/post-${id}`,
                            values,
                            {
                                headers: {
                                    Authorization: "Bearer " + localStorage.getItem("token"),
                                },
                            }
                        );

                        if (response.status == 200) {
                            setComments(comments => comments?.concat([{
                                status: "ACTIVE",
                                content: values.content,
                                date: new Date(),
                                username: "Me",
                                account: localStorage.getItem("username") || "",
                                isMine: true,
                                id: response.data?.id ?? -1,
                                childrenNumber: 0
                            }]) || []);
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
        </Container>
    </>
};

export default PostPage;
