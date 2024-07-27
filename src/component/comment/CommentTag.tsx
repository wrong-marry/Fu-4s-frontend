import {
    ActionIcon,
    Anchor,
    Avatar, Badge,
    Button,
    Card,
    CardSection, Collapse,
    Container,
    Flex,
    Group, HoverCard, Modal, rem,
    Space,
    Stack,
    Text,
    Textarea, TypographyStylesProvider
} from "@mantine/core"

import {CommentData} from "../../page/post/PostPage";
import {format} from "date-fns";
import axios, {AxiosError, AxiosResponse} from "axios";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";
import {CommentButtonSwitch} from "../comment-button-switch/CommentButtonSwitch.tsx";
import {IconMessageReply} from "@tabler/icons-react";
import {BASE_URL} from "../../common/constant.tsx";

interface CommentTagData extends CommentData {
    updateFunction: (id: number, content: string) => void;
}

export const Comment = (props: CommentTagData) => {
    const [replyOpened, {open: openReply, close: closeReply}] = useDisclosure(true);
    const [childrenOpened, {open: openChildren, close: closeChildren}] = useDisclosure(false);
    const [opened, {open, close}] = useDisclosure(false);
    const username = props.username;
    const [content, setContent] = useState(props.content);
    const time = props.date;
    const isMine: boolean = props.isMine;
    const id = props.id;
    const childrenNumber = props.childrenNumber;
    const [status, setStatus] = useState(props.status);
    const [hideText, setHideText] = useState(props.status == "ACTIVE" ? "Hide" : "Unhide");
    const [children, setChildren] = useState<CommentData[]>();
    useEffect(() => {
        setHideText(status == "ACTIVE" ? "Hide" : "Unhide");
    }, [status]);

    const [contentStack, setContentStack] = useState(
        defaultContentStack(content, hideText)
    );

    useEffect(() => {
        setContentStack(defaultContentStack(content, hideText));
    }, [hideText]);

    useEffect(() => {
        form.setInitialValues({"content": content});
        form.setValues({"content": content});
    }, [content]);

    function handleReplyClick() {
        if (!childrenOpened) {
            getChildren();
            openChildren();
        } else {
            if (replyOpened) {
                closeReply();
                console.log("closed");
            } else {
                openReply();
                console.log("opened");
            }
        }
    }

    function getChildren() {
        const response = axios.get(`${BASE_URL}/api/v1/comments/children/comment-${id}`);
        response.then(data => {
            setChildren([...data.data] as CommentData[]);
        }).catch(error => console.log(error))
    }

    function defaultContentStack(newContent: string, hideText: string) {
        const updateStatus = async () => {
            try {
                const response = await axios.put(`${BASE_URL}/api/v1/comments/status/${id}`, {
                    headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                });
                if (response.status === 200) {
                    setStatus(status => status === "ACTIVE" ? "HIDDEN" : "ACTIVE");
                }
            } catch (error) {
                console.error("Error updating status:", error);
            }
        };

        return (<Stack gap={3}>
            <Card p={"sm"} withBorder radius={20} maw={"800"}>
                <CardSection inheritPadding py="md" pb={"xs"}>
                    <Flex>
                        <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                        <Space w={"md"}/>
                        <Text px={"md"} fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                    </Flex>
                </CardSection>
                <CardSection inheritPadding py="md" pt={"xs"}>
                    <Text w={"100%"} lh={"xs"} px={"md"} component="div">
                        <TypographyStylesProvider style={{wordWrap: "break-word",}}>
                            {newContent}
                        </TypographyStylesProvider>
                    </Text>
                </CardSection>
            </Card>

            <Group mt={0} mx={"md"} lh={"xs"}>
                <Anchor fz={"sm"} mx={"sm"} mt={0} onClick={handleReplyClick}
                >{childrenNumber ? "View replies..." : "Reply"}</Anchor>
                {isMine ?
                    <>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={updateComment}>Update</Anchor>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={open}>Delete</Anchor>
                    </> : <>
                        {
                            ["STAFF", "ADMIN"].includes((localStorage.getItem("role") + "")) &&
                            <Anchor fz={"sm"} mx={"sm"}
                                    onClick={updateStatus}
                            >{hideText}</Anchor>
                        }
                    </>}
            </Group>
        </Stack>) as React.ReactElement;
    }

    const deleteComment = async (id: number) => {
        try {
            const response = await axios.delete(
                `${BASE_URL}/api/v1/comments/` + id,
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
                closeChildren();
            }
        } catch (e) {
            console.log(e)
        }
    }
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            'content': content,
        },
        validate: {
            content: (value: string) => (/^\S/.test(value) ? null : 'Invalid content'),
        },
    });
    const replyForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: localStorage.getItem("username"),
            'content': "@" + props.account + " ",
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
                        <form onSubmit={form.onSubmit((values) => {
                            axios.put(
                                `${BASE_URL}/api/v1/comments/update/${id}`,
                                values,
                                {
                                    headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                                }
                            )
                                .then((response: AxiosResponse<string>) => {
                                    if (response.status === 200) {
                                        setContent(values.content);
                                        console.log("Updated, form value: " + values.content + ", new content: " + content);
                                        form.setFieldValue("content", values.content);
                                        form.setInitialValues({"content": values.content});
                                        setContentStack(defaultContentStack(values.content, status));
                                        props.updateFunction(id, values.content);
                                    }
                                })
                                .catch((error: AxiosError) => {
                                        console.error("Error updating comment:", error);
                                    }
                                ).finally(() => {
                            });
                        })}>
                            <Textarea size={"md"} my={"sm"} mt={0} placeholder={"Type in your comment"} autosize
                                      minRows={2}
                                      maxRows={4}
                                      key={form.key('content')}
                                      {...form.getInputProps('content')}
                            ></Textarea>
                            <Group justify={"flex-end"}>
                                <Button size={"xs"} mb={"xs"} color={"gray"}
                                        onClick={() => setContentStack(defaultContentStack(content, status))}>Cancel</Button>
                                <Button ms={"md"} size={"xs"} mb={"xs"} type={"submit"}>Save</Button>
                            </Group>
                        </form>
                    </CardSection>
                </Card>
                <Group mt={0} mx={"md"} lh={"xs"}>
                    <Anchor fz={"sm"} mx={"sm"} mt={0}
                            onClick={handleReplyClick}>{childrenNumber ? "View replies..." : "Reply"}</Anchor>
                    <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={updateComment}>Update</Anchor>
                    <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={open}>Delete</Anchor>
                </Group>
            </Stack>
        );
    }

    return (
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
                {status != "ACTIVE" ? <HoverCard width={200} shadow="md">
                    <HoverCard.Target>
                        <Badge size={"xs"} color={"red"} style={{position: "absolute"}} mt={60} ms={-6}>
                            Hidden
                        </Badge>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">
                            This comment is hidden by a Staff.
                        </Text>
                    </HoverCard.Dropdown>
                </HoverCard> : <></>}
                {contentStack}
                {childrenNumber > 0 ?
                    <ActionIcon mt={"sm"} color={childrenOpened ? "red" : "teal"}><CommentButtonSwitch
                        checked={childrenOpened}
                        onChange={(checked) => {
                            if (checked) {
                                getChildren();
                                openChildren();
                            } else closeChildren();
                        }}
                        size={20}/></ActionIcon> : <></>}
            </Group>
            <Container ms={"md"}>
                <Collapse in={childrenOpened}>
                    <form
                        onSubmit={replyForm.onSubmit(async (values) => {
                            console.log(values);
                            try {
                                const response: AxiosResponse<{ message: string, id: number }> = await axios.post(
                                    `${BASE_URL}/api/v1/comments/upload/comment-${id}`,
                                    values,
                                    {
                                        headers: {
                                            Authorization: "Bearer " + localStorage.getItem("token"),
                                        },
                                    }
                                );
                                if (response.status == 200) {
                                    setChildren(comments => comments?.concat([{
                                        status: "ACTIVE",
                                        content: values.content,
                                        date: new Date(),
                                        username: "Me",
                                        account: localStorage.getItem("username") || "",
                                        isMine: true,
                                        id: response.data?.id ?? -1,
                                        childrenNumber: 0
                                    }]) || []);
                                    replyForm.reset();
                                }
                            } catch (error) {
                                console.error("Error posting comment:", error);
                            }
                        })}
                    >
                        <Collapse in={replyOpened}>
                            <Textarea
                                radius={"xl"}
                                size={"md"}
                                my={"md"}
                                placeholder={"Reply"}
                                autosize
                                maxRows={4}
                                key={replyForm.key("content")}
                                {...replyForm.getInputProps("content")}
                                rightSection={
                                    <ActionIcon size={32} radius="xl" variant="filled" type={"submit"}>
                                        <IconMessageReply style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                                    </ActionIcon>
                                }
                            ></Textarea>
                        </Collapse>
                    </form>
                    {children?.map((item) => (
                        <Comment id={item.id} date={item.date} account={item.account}
                                 username={item.username} content={item.content}
                                 status={item.status} isMine={item.account == localStorage.getItem("username")}
                                 childrenNumber={item.childrenNumber} key={item.id}
                                 updateFunction={props.updateFunction}></Comment>
                    ))}
                </Collapse>
            </Container>
        </Container>)
}