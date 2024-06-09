import {
    Button,
    Center,
    Container,
    FileInput,
    Grid, List, ListItem,
    Paper,
    Space,
    TextInput, ThemeIcon,
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
    const [files, setFiles] = useState<File[]>([]);
    const [subject, setSubject] = useState<string | null>();
    const [subjectList, setSubjectList] = useState<Subject[]>([]);

    const [error, setError] = useState<string>("");

    useEffect(() =>{
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
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'align': [] }],
        [{ 'color': [] }],
        ['blockquote', 'code-block'],
        [{ 'direction': 'rtl' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        ['clean'],
    ];
    const module = {
        toolbar: toolbarOptions,
    };

    const handleAdd = () => {
        const formData = new FormData();
        files.forEach((file: File) => {
            formData.append("files", file);
        });

        fetch(`http://localhost:8080/api/v1/learningMaterial/addNew?title=${title}&content=${content}&username=${localStorage.getItem("username")}&subjectCode=${subject}`,
            {
                method: "POST",
                body: formData
            }).then(() => {
                navigate('/user/post');
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

    const dataSubject = subjectList.map((subject) => (
            {
                value: subject.code,
                label: subject.code + " - " + subject.name + " - Semester: " + subject.semester,
            }
        )
    );

    const listData = files.length == 0 ? <ListItem><i>no files yet</i></ListItem> : files.map((file, index) => {
        return <ListItem key={index} mb="xs">
                <Text onClick={() => handleDownloadFile(file)} td="underline" color="blue" type="button" component="button">{file.name}</Text>
            </ListItem>

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
                    <ReactQuill modules={module} theme="snow" onChange={setContent} value={content} style={{height: "60vh"}}/>

                    <Space h="lg"/>
                    <Space h="md"/>

                    <Space h="lg"/><Space h="lg"/>
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

                    <Space h="xs"/>

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

                    <Space h="lg"/>

                    <Grid>
                        <Grid.Col span={2} offset={8}>
                            <Center>
                                <Button color="black" variant="outline" onClick={() => navigate("/home")} ml="lg">
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
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    </>
}