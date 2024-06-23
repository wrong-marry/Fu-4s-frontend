import {
    Button,
    Center,
    Container,
    FileInput,
    Grid, List,
    Paper,
    Space,
    TextInput,
    Title,
    Text, Select
} from "@mantine/core";
import classes from "../../user-profile/update-profile/AuthenticationTitle.module.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Subject {
    code: string;
    name: string;
    semester: number;
}

export function AddLearningMaterialForm() {
    const navigate = useNavigate();
    const maxSize = 2 * 1024 * 1024 * 1024;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[] | null>(null);
    const [subject, setSubject] = useState<string | null>();
    const [subjectList, setSubjectList] = useState<Subject[]>([]);

    const [error, setError] = useState<string>("");
    const [errorAll, setErrorAll] = useState<string>("");

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/subject/getAll`
                );
                const data = await response.json();
                setSubjectList(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchSubject();
    }, [])

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{'header': 1}, {'header': 2}],
        [{'align': []}],
        [{'color': []}],
        ['blockquote', 'code-block'],
        [{'direction': 'rtl'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
        ['clean'],
    ];
    const module = {
        toolbar: toolbarOptions,
    };

    const handleAdd = () => {
        if (title == "" || content == "" || subject == null) {
            setErrorAll("Please fill all required fields!");
            return;
        }

        const formData = new FormData();
        if (files != null) files.forEach((file: File) => {
            formData.append("files", file);
        });

        fetch(`http://localhost:8080/api/v1/learningMaterial/addNew?title=${title}&content=${content}&username=${localStorage.getItem("username")}&subjectCode=${subject}`,
            {
                method: "POST",
                body: formData
            }).then(() => {
            navigate('/user/post/learning-material');
        })
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
            if (f.size > maxSize) {
                setError("Files must be smaller than 2GB!");
                check = true;
            }
        });

        if (check) {
            setFiles(null);
            return;
        }

        setError("");
        if (fs.length == 0) setFiles(null);
        else setFiles(fs);
    }

    const dataSubject = subjectList.map((subject) => (
            {
                value: subject.code,
                label: subject.code + " - " + subject.name + " - Semester: " + subject.semester,
            }
        )
    );

    const listData = files == null ? <List.Item><i>no files yet</i></List.Item> : files.map((file, index) => {
        return <List.Item mb="xs">
            <Text onClick={() => handleDownloadFile(file)} td="underline" color="blue" type="button"
                  component="button">{file.name}</Text>
        </List.Item>

    })
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

                    <Space h="lg"/>
                    <Space h="md"/>

                    <Select
                        label="Subject"
                        description="Your material subject"

                        value={subject}
                        onChange={setSubject}

                        data={dataSubject}

                        searchable
                        required
                        radius="md"
                    />

                    <Space h="lg"/>
                    <Space h="md"/>

                    <label className="m_8fdc1311 mantine-InputWrapper-label mantine-TextInput-label"
                           data-required="true" htmlFor="mantine-sjauq2siu" id="mantine-sjauq2siu-label">Content<span
                        className="m_78a94662 mantine-InputWrapper-required mantine-TextInput-required"
                        aria-hidden="true"> *</span></label>
                    <p className="m_fe47ce59 mantine-InputWrapper-description mantine-TextInput-description"
                       id="mantine-sjauq2siu-description">Your material content</p>
                    <Space h="xs"/>
                    <ReactQuill modules={module} theme="snow" onChange={setContent} value={content}
                                style={{height: "60vh"}}/>

                    <Space mb='md' h="lg"/>
                    <Space h="md"/>

                    <Space h="lg"/><Space h="lg"/>
                    <Grid>
                        <Grid.Col span={5}>
                            <FileInput
                                radius="md"
                                label="Attached files"
                                description="Optional. Choose all files at a time. Only accept files < 2GB"
                                placeholder="Choose files"
                                onChange={(fs) => handleSetFiles(fs)}
                                multiple
                                clearable
                                error={error}
                            />
                        </Grid.Col>
                    </Grid>

                    <Space h="xs"/>

                    <List
                        icon="•"
                        withPadding
                        size="sm"
                    >
                        {listData}
                    </List>

                    <Space h="lg"/>

                    <Grid>
                        <Grid.Col span={2} offset={8}>
                            <Center>
                                <Button color="red" variant="outline" onClick={() => navigate("/home")} ml="lg">
                                    Back
                                </Button>
                            </Center>
                        </Grid.Col>

                        <Grid.Col span={2}>
                            <Center>
                                <Button onClick={handleAdd} color="blue">
                                    Create
                                </Button>
                            </Center>
                            <Text size="xs" color="red">{errorAll}</Text>
                        </Grid.Col>

                    </Grid>


                </form>
            </Paper>
        </Container>
    </>
}