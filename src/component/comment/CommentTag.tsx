import {
    Anchor,
    Avatar,
    Button,
    Card,
    CardSection,
    Container,
    Flex,
    Group,
    Space,
    Stack,
    Text,
    Textarea
} from "@mantine/core"

import {CommentData} from "../../page/post/PostPage";
import {format} from "date-fns";
import axios, {AxiosResponse} from "axios";
import React, {useState} from "react";
import {useForm} from "@mantine/form";

export default function Comment(props: CommentData) {
    const username = props.username;
    const [content, setContent] = useState(props.content);
    const time = props.date;
    const isMine: boolean = props.isMine;
    const id = props.id;
    const [status, setStatus] = useState(props.status);

    const [contentStack, setContentStack] = useState(
        <Stack gap={3}>
            <Card p={"sm"} withBorder radius={20}>
                <CardSection inheritPadding py="md" pb={"xs"}>
                    <Flex>
                        <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                        <Space w={"md"}/>
                        <Text px={"md"} fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                    </Flex>
                </CardSection>
                <CardSection inheritPadding py="md" pt={"xs"}>
                    <Text lh={"xs"} px={"md"}>{content}</Text>
                </CardSection>
            </Card>
            <Group mt={0} mx={"md"} lh={"xs"}>
                <Anchor fz={"sm"} mx={"sm"} mt={0}>Love</Anchor>
                {isMine ?
                    <>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={updateComment}>Update</Anchor>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={() => deleteComment(id)}>Delete</Anchor>
                    </> : <>
                        <Anchor fz={"sm"} mx={"sm"}>Reply</Anchor>
                        {
                            ["STAFF", "ADMIN"].includes((localStorage.getItem("role") + "")) &&
                            <Anchor fz={"sm"} mx={"sm"}
                                    onClick={async () => {
                                        const response = await axios.put(`http://localhost:8080/api/v1/comments/status/${id}`,
                                            {
                                                headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                                            }
                                        );
                                        if (response.status == 200) setStatus(status == "ACTIVE" ? "Hide" : "Unhide");
                                    }}
                            >{status == "ACTIVE" ? "Hide" : "Unhide"}</Anchor>
                        }
                    </>}
            </Group>
        </Stack> as React.ReactElement
    );

    const deleteComment = async (id: number) => {
        try {
            const response = await axios.delete(
                "http://localhost:8080/api/v1/comments/" + id,
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
            if (response.status == 200) {
                setContentStack(
                    <Card p={"sm"} withBorder radius={20}>
                        <CardSection inheritPadding py="md" pb={"xs"}>
                            <Flex>
                                <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                                <Space w={"md"}/>
                                <Text px={"md"} fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                            </Flex>
                        </CardSection>
                        <CardSection inheritPadding py="xs" pb={"md"}>
                            <Text lh={"xs"} px={"md"} ta={"center"} fw={600}>{response.data.message}</Text>
                        </CardSection>
                    </Card>
                );
                console.log(response);
            }
        } catch (e) {
            console.log(e)
        }
    }
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            'content': props.content,
        },
        validate: {
            content: (value: string) => (/^\S/.test(value) ? null : 'Invalid content'),
        },
    });

    function updateComment() {
        setContentStack(
            <Stack gap={3}>
                <Card p={"sm"} withBorder radius={20}>
                    <CardSection inheritPadding py="md" pb={"xs"}>
                        <Flex>
                            <Text fw={650} lh={"md"} px={"md"}>{username}</Text>
                            <Space w={"md"}/>
                            <Text px={"md"} fw={200} lh={"md"}
                                  fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                        </Flex>
                    </CardSection>
                    <CardSection inheritPadding py="xs" pt={0}>
                        <form onSubmit={form.onSubmit(async (values) => {
                            console.log(values);
                            try {
                                const response: AxiosResponse<string> = await axios.put(
                                    `http://localhost:8080/api/v1/comments/update/${id}`,
                                    values,
                                    {
                                        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                                    }
                                )
                                if (response.status == 200) {
                                    console.log("Updated, new content: " + values.content);
                                    setContent(values.content);
                                    setContentStack(contentStack);
                                }
                            } catch (error) {
                                console.error("Error posting comment:", error);
                            }
                        })}>
                            <Textarea size={"md"} my={"sm"} mt={0} placeholder={"Type in your comment"} autosize
                                      minRows={2}
                                      maxRows={4}
                                      key={form.key('content')}
                                      {...form.getInputProps('content')}
                            ></Textarea>
                            <Group justify={"flex-end"}>
                                <Button size={"xs"} mb={"xs"} color={"gray"}
                                        onClick={() => setContentStack(contentStack)}>Cancel</Button>
                                <Button ms={"md"} size={"xs"} mb={"xs"} type={"submit"}>Save</Button>
                            </Group>
                        </form>
                    </CardSection>
                </Card>
                <Group mt={0} mx={"md"} lh={"xs"}>
                    <Anchor fz={"sm"} mx={"sm"} mt={0}>Love</Anchor>
                    {isMine ?
                        <>
                            <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={updateComment}>Update</Anchor>
                            <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={() => deleteComment(id)}>Delete</Anchor>
                        </> : <Anchor fz={"sm"} mx={"sm"}>Reply</Anchor>}
                </Group>
            </Stack>
        );
    }

    return (<>
        <Container w={"100%"}>
            <Group m={"md"} align={"flex-start"}>

                <Avatar variant="filled" radius="xl" size="md" mt={"sm"}/>
                {contentStack}
            </Group>
        </Container>
    </>)
}