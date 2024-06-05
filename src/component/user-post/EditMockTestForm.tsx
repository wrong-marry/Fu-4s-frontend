import {
    Button,
    Container, FileInput,
    Grid,
    Paper, Select,
    Space,
    TextInput,
    Title,
    Text, Modal
} from "@mantine/core";
import classes from "../user-profile/update-profile/AuthenticationTitle.module.css";
import {useEffect, useState} from "react";
import * as XLSX from 'xlsx'
import {useNavigate, useParams} from "react-router-dom";
import {i, j} from "vite/dist/node/types.d-FdqQ54oU";
import {number} from "zod";
import {useDisclosure} from "@mantine/hooks";

interface MockTest {
    id: string;
    title: string;
    subjectCode: string;
    questions: Question[];
}

interface Subject {
    code: string;
    name: string;
    semester: number;
}

interface Question {
    content: string;
    answers: Answer[];
}

interface Answer {
    content: string;
    correct: boolean;
}

interface row {
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    content: string;
    correct: string
}

export function EditMockTestForm() {
    const { id } = useParams<{ id: string }>();
    const [subject, setSubject] = useState<string | null>('');
    const [subjectList, setList] = useState<Subject[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [errorFile, setError] = useState<string | null>(null);
    const [fileData, setFileData] = useState<row[]>([]);
    const [errorAll, setErrorAll] = useState('');
    const [test, setTest] = useState<MockTest>();
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();

    const isExcelFile = (file: File) => {
        const allowedExtensions = ['.xlsx', '.xls']
        const fileName = file.name
        const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
        return allowedExtensions.includes(fileExtension)

    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if(e.target == null) {
            setError("Invalid file! Only accept Excel file!")
            throw new Error("Invalid");
        }

        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json : row[] = XLSX.utils.sheet_to_json(worksheet);
        setFileData(json);
    };

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/subject/getAll`
                );
                const data = await response.json();
                //console.log(data);
                setList(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        const fetchMockTest = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/questionSet/getById?id=` + id
                );
                const data = await response.json();
                setTest(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchMockTest();
        fetchSubject();
    }, []);

    useEffect(() => {
        if(file == null) return;
        if(!isExcelFile(file)) {
            setError("Invalid file! Only accept Excel file!");
            return;
        }

        reader.readAsArrayBuffer(file);
        setError(null);
    }, [file])

    const dataSubject = subjectList.map((subject) => (
            {
                value: subject.code,
                label: subject.code + " - " + subject.name + " - Semester: " + subject.semester,
            }
        )
    );

    const handleAdd = () => {
        if(file == null || !isExcelFile(file) || title == "" || subject == "") {
            setErrorAll("All fields are required");
            return;
        }

        setError(null);
        let questions: Question[] = [];
        for(var row of fileData) {
            let answers : Answer[] = [];

            let answer : Answer = {
                content: row.answer1,
                correct: row.correct == "1"
            };
            answers.push(answer);

            answer = {
                content: row.answer2,
                correct: row.correct == "2"
            };
            answers.push(answer);

            answer = {
                content: row.answer2,
                correct: row.correct == "3"
            };
            answers.push(answer);

            answer = {
                content: row.answer2,
                correct: row.correct == "4"
            };
            answers.push(answer);

            let question : Question = {
                content: row.content,
                answers: answers
            }

            questions.push(question);
        }

        fetch(`http://localhost:8080/api/v1/questionSet/addNew?title=${title}&subjectCode=${subject}&username=${localStorage.getItem('username')}`, {
            method: "POST",
            body: JSON.stringify(questions),
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response: Response) => response.json())
            .then(() => {
                navigate(`/user/post`);
            })

    }
    if(test == null) return <></>

    console.log(test.questions)
    const downloadQuestion = () => {
        const fileName = 'questions.xlsx';
        const data = test.questions.map(value => {
            if(value.answers.length == 0) return {};

            let correct = 0;
            for(let i = 0; i < 4; i++) {
                if(value.answers[i].correct) correct = i + 1;
            }
            return {
                content: value.content,
                answer1: value.answers[0].content,
                answer2: value.answers[1].content,
                answer3: value.answers[2].content,
                answer4: value.answers[3].content,
                correct: correct
            }
        });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'test');

        XLSX.writeFile(wb, fileName);
    }


    return <>
        <Modal opened={opened} onClose={close} title="Import instruction">
            <Text size="sm">
                The system only accept excel (.xlsx) files. File must be in the following format:
                <Space h="sm"></Space>
                <img src="/src/asset/excelFileFormat.png" alt=""/>
                <Space h="sm"></Space>
                <Space h="sm"></Space>
                <Space h="sm"></Space>
                <b>Example:</b>
                <Space h="sm"></Space>
                <img src="/src/asset/fileFormatExample.png" alt=""/>
                <Space h="sm"></Space>
                <Space h="sm"></Space>
                <Space h="sm"></Space>
                The above example will add a mock test with one question with the content <i>"What is 5 + 2" </i>
                with 4 answers: <i>5, 6, 7 and 8</i>.
                The index of the correct question is 3, which the the answer 7.
            </Text>
        </Modal>

        <Container size={900} my={40}>
            <Title ta="center" className={classes.title} order={2}>
                Edit Mock Test
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form>
                    <Grid>
                        <Grid.Col span={5}>
                            <TextInput
                                label="Title"
                                description="Your mock test title"
                                placeholder="Enter title"
                                onChange={(event) => setTitle(event.currentTarget.value)}
                                required
                                radius="md"
                                value={test.title}
                            />

                            <Space h="md" />

                            <Select
                                label="Subject"
                                description="Your mock test subject"

                                value={test?.subjectCode}
                                onChange={setSubject}

                                data={dataSubject}

                                searchable
                                required
                                radius="md"
                                disabled
                            />

                            <Space h="md" />

                        </Grid.Col>
                        <Grid.Col span={2}></Grid.Col>
                        <Grid.Col span={5}>
                            <FileInput
                                radius="md"
                                label="Questions"
                                withAsterisk
                                description="Import your question"
                                placeholder="Choose your file"

                                error={errorFile}

                                onChange={setFile}
                                accept={".xlsx"}
                            />
                            <Text c="dimmed" size="xs">Only accept excel files. Import format instruction <Text type="button" td="underline" color="blue" component="button" onClick={open}>here</Text></Text>
                            <Text c="dimmed" size="xs">Click <Text td="underline" color="blue" component="button" type="button" onClick={downloadQuestion}>here</Text> to download your old questions</Text>

                            <Space h="xs" />

                            <Button onClick={handleAdd}  mt="xl" >
                                Edit Mock Test
                            </Button>

                            <Text size="xs" color="red">{errorAll}</Text>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    </>
}