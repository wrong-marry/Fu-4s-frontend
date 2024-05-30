import {
    Button,
    Container, FileInput,
    Grid,
    Paper, Select,
    Space,
    TextInput,
    Title
} from "@mantine/core";
import classes from "../user-profile/update-profile/AuthenticationTitle.module.css";
import {useEffect, useState} from "react";
import * as XLSX from 'xlsx'
import {data} from "autoprefixer";
import {useNavigate} from "react-router-dom";

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

export function CreateMockTestForm() {
    const [subject, setSubject] = useState<string | null>('');
    const [subjectList, setList] = useState<Subject[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [errorFile, setError] = useState<string | null>(null);
    const [fileData, setFileData] = useState<row[]>([]);
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
        if(file == null || !isExcelFile(file) || title == null || subject == null) return;

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
            .then((data) => {
                navigate(`/post/${data.id}`);
            })

    }

    return <>
        <Container size={900} my={40}>
            <Title ta="center" className={classes.title} order={2}>
                Create new Mock Test
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
                            />

                            <Space h="md" />

                            <Select
                                label="Subject"
                                description="Your mock test subject"

                                value={subject}
                                onChange={setSubject}

                                data={dataSubject}

                                searchable
                                required
                                radius="md"
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

                            <Space h="md" />

                            <Button onClick={handleAdd}  mt="xl" >
                                Add Mock Test
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    </>
}