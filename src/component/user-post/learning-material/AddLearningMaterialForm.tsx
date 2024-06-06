import {
    Button,
    Center,
    Container,
    FileInput,
    Grid, List, ListItem,
    Paper,
    Space,
    Textarea,
    TextInput, ThemeIcon,
    Title,
    Text
} from "@mantine/core";
import classes from "../../user-profile/update-profile/AuthenticationTitle.module.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export function AddLearningMaterialForm() {
    const navigate = useNavigate();
    const maxSize = 10 * 1024 * 1024;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const [error, setError] = useState<string>("");

    const handleAdd = () => {

    }

    const handleDownloadFile = (file: File) => {
        const url = window.URL.createObjectURL(
            new Blob([file]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            file.name,
        );

        document.body.appendChild(link);
        link.click();

        // @ts-ignore
        link.parentNode.removeChild(link);
    }

    const handleSetFiles = (fs: File[]) => {
        var check: boolean = false;
        fs.forEach(f => {
            if(f.size > maxSize)
            {
                setError("Files must be smaller than 2GB!");
                check = true;
            }
        });

        if(check) {
            setFiles([]);
            return;
        }

        setError("");
        setFiles(fs);
    }

    const listData = files.length == 0 ? <ListItem><i>no files yet</i></ListItem> : files.map((file, index) => {
        return <ListItem key={index} mb="xs">
                <Text onClick={() => handleDownloadFile(file)} td="underline" color="blue" type="button" component="button">{file.name}</Text>
            </ListItem>

    })
    console.log(files[0])
    return <>
        <Container size={900} my={40}>
            <Title ta="center" className={classes.title} order={2}>
                Create new Learning Material
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form>
                    <TextInput
                        label="Title"
                        description="Your material title"
                        placeholder="Enter title"
                        onChange={(event) => setTitle(event.currentTarget.value)}
                        required
                        radius="md"
                    />

                    <Space h="lg" />
                    <Space h="md" />

                    <Textarea
                        placeholder="Type something..."
                        label="Content"
                        description="Your material content"
                        onChange={(event) => setContent(event.currentTarget.value)}
                        autosize
                        required
                        minRows={12}
                        radius="md"
                    />

                    <Space h="lg" />
                    <Space h="md" />

                    <Grid>
                        <Grid.Col span={5}>
                            <FileInput
                                radius="md"
                                label="Attached files"
                                withAsterisk
                                description="Choose all files at a time. Only accept files < 2GB"
                                placeholder="Choose files"
                                onChange={(fs) => handleSetFiles(fs)}
                                multiple
                                clearable
                                error={error}
                            />
                        </Grid.Col>
                    </Grid>

                    <Space h="xs" />

                    <List
                        icon={
                            <ThemeIcon color="black" size={7} radius="xl">
                            </ThemeIcon>
                        }
                        withPadding
                        size="sm"
                    >
                        {listData}
                    </List>

                    <Space h="lg" />

                    <Grid >
                        <Grid.Col span={2} offset={8}>
                            <Center>
                                <Button variant="default" size="md" onClick={() => navigate("/user/post")}  ml="lg">
                                    Back
                                </Button>
                            </Center>
                        </Grid.Col>

                        <Grid.Col span={2}>
                            <Center>
                                <Button onClick={handleAdd} color="blue" size="md">
                                    Create
                                </Button>
                            </Center>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    </>
}