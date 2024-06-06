import {
    Anchor,
    Avatar,
    Button,
    Card,
    CardSection,
    Container,
    Flex,
    Group, Modal,
    Space,
    Stack,
    Text,
    Textarea
} from "@mantine/core"

import {CommentData} from "../../page/post/PostPage";
import {format} from "date-fns";
import axios, {AxiosError, AxiosResponse} from "axios";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";

export const Comment = (props: CommentData) => {
    const [opened, {open, close}] = useDisclosure(false);
    const username = props.username;
    const [content, setContent] = useState(props.content);
    const time = props.date;
    const isMine: boolean = props.isMine;
    const id = props.id;
    const [status, setStatus] = useState(props.status);
    const [hideText, setHideText] = useState(props.status == "ACTIVE" ? "Hide" : "Unhide");
    useEffect(() => {
        setHideText(status == "ACTIVE" ? "Hide" : "Unhide");
        console.log("Hide text set to: " + hideText);
    }, [status]);
    const [contentStack, setContentStack] = useState(
        defaultContentStack(content)
    );

    function defaultContentStack(newContent: string) {
        return (<Stack gap={3}>
            <Card p={"sm"} withBorder radius={20}>
                <CardSection inheritPadding py="md" pb={"xs"}>
                    <Flex>
                        <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                        <Space w={"md"}/>
                        <Text px={"md"} fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                    </Flex>
                </CardSection>
                <CardSection inheritPadding py="md" pt={"xs"}>
                    <Text lh={"xs"} px={"md"}>{newContent}</Text>
                </CardSection>
            </Card>
            <Group mt={0} mx={"md"} lh={"xs"}>
                <Anchor fz={"sm"} mx={"sm"} mt={0}>Love</Anchor>
                {isMine ?
                    <>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={updateComment}>Update</Anchor>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={open}>Delete</Anchor>
                    </> : <>
                        <Anchor fz={"sm"} mx={"sm"}>Reply</Anchor>
                        {
                            ["STAFF", "ADMIN"].includes((localStorage.getItem("role") + "")) &&
                            <Anchor fz={"sm"} mx={"sm"}
                                    onClick={() => {
                                        const response = axios.put(`http://localhost:8080/api/v1/comments/status/${id}`,
                                            {
                                                headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                                            }
                                        );
                                        response.then(value => {
                                            if (value.status == 200) setStatus(status => (status == "ACTIVE") ? "HIDDEN" : "ACTIVE");
                                            console.log(value.data.message);
                                        })
                                    }}
                            >{hideText}</Anchor>
                        }
                    </>}
            </Group>
        </Stack>) as React.ReactElement;
    }
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
                            axios.put(
                                    `http://localhost:8080/api/v1/comments/update/${id}`,
                                    values,
                                    {
                                        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                                    }
                                )
                                .then((response: AxiosResponse<string>) => {
                                    if (response.status === 200) {
                                        setContent(values.content);
                                        console.log("Updated, form value: " + values.content + ", new content: " + content);
                                        setContentStack(defaultContentStack(values.content));
                                    }
                                })
                                .catch((error: AxiosError) => {
                                        console.error("Error updating comment:", error);
                                    }
                                );
                        })}>
                            <Textarea size={"md"} my={"sm"} mt={0} placeholder={"Type in your comment"} autosize
                                      minRows={2}
                                      maxRows={4}
                                      key={form.key('content')}
                                      {...form.getInputProps('content')}
                            ></Textarea>
                            <Group justify={"flex-end"}>
                                <Button size={"xs"} mb={"xs"} color={"gray"}
                                        onClick={() => setContentStack(defaultContentStack(content))}>Cancel</Button>
                                <Button ms={"md"} size={"xs"} mb={"xs"} type={"submit"}>Save</Button>
                            </Group>
                        </form>
                    </CardSection>
                </Card>
                <Group mt={0} mx={"md"} lh={"xs"}>
                    <Anchor fz={"sm"} mx={"sm"} mt={0}>Love</Anchor>
                    <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={updateComment}>Update</Anchor>
                    <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={open}>Delete</Anchor>
                </Group>
            </Stack>
        );
    }

    return (<>
        <Container w={"100%"}>
            <Modal opened={opened} onClose={close} title="Confirm deletion" centered>
                Delete comment?
                <Group justify={"flex-end"}>
                    <Button size={"xs"} mb={"xs"} color={"gray"}
                            onClick={close}>Cancel</Button>
                    <Button ms={"md"} size={"xs"} mb={"xs"}
                            onClick={() => {
                                deleteComment(id);
                                close();
                            }}
                    >Delete</Button>
                </Group>
            </Modal>
            <Group m={"md"} align={"flex-start"}>

                <Avatar variant="filled" radius="xl" size="md" mt={"sm"}/>
                {contentStack}
            </Group>
        </Container>
    </>)
}