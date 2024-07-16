import {
    Button,
    Container, FileInput,
    Grid,
    Paper, Select,
    Space,
    TextInput,
    Title,
    Text, Modal, Divider
} from "@mantine/core";
import classes from "../../user-profile/update-profile/AuthenticationTitle.module.css";
import {useEffect, useState} from "react";
import * as XLSX from 'xlsx'
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import {BASE_URL} from "../../../common/constant.tsx";

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
    const [errorAll, setErrorAll] = useState('');
    const [opened, {open, close}] = useDisclosure(false);
    const navigate = useNavigate();

    const isExcelFile = (file: File) => {
        const allowedExtensions = ['.xlsx', '.xls']
        const fileName = file.name
        const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
        return allowedExtensions.includes(fileExtension)

    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target == null) {
            setError("Invalid file! Only accept Excel file!")
            throw new Error("Invalid");
        }

        const data = e.target.result;
        const workbook = XLSX.read(data, {type: "array"});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json: row[] = XLSX.utils.sheet_to_json(worksheet);
        if (json.length == 0) {
            setError("Invalid file! Must have at least 1 question!");
            return;
        }
        setFileData(json);
    };

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/api/v1/subject/getAll`
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
        if (file == null) return;
        if (!isExcelFile(file)) {
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
        if (file == null || !isExcelFile(file) || title == "" || subject == "") {
            setErrorAll("All fields are required");
            return;
        }

        setError(null);
        let questions: Question[] = [];
        for (var row of fileData) {
            let answers: Answer[] = [];

            if (parseInt(row.correct) > 4 || parseInt(row.correct) < 1) {
                setError("Invalid file format! Please read the instruction!");
                return;
            }

            if (!row.answer1) {
                console.log(row.answer1);
                setError("Invalid file format! Please read the instruction!");
                return;
            }
            let answer: Answer = {
                content: row.answer1, correct: row.correct == "1"
            };
            answers.push(answer);
            console.log(row.answer2);
            if (!row.answer2) {
                setError("Invalid file format! Please read the instruction!");
                return;
            }
            answer = {
                content: row.answer2, correct: row.correct == "2"
            };
            answers.push(answer);

            if (!row.answer3) {
                setError("Invalid file format! Please read the instruction!");
                return;
            }
            answer = {
                content: row.answer3, correct: row.correct == "3"
            };
            answers.push(answer);

            if (!row.answer4) {
                setError("Invalid file format! Please read the instruction!");
                return;
            }
            answer = {
                content: row.answer4, correct: row.correct == "4"
            };
            answers.push(answer);

            if (!row.content) {
                console.log(1);
                setError("Invalid file format! Please read the instruction!");
                return;
            }
            let question: Question = {
                content: row.content, answers: answers
            }

            questions.push(question);
        }

        fetch(`${BASE_URL}/api/v1/questionSet/addNew?title=${title}&subjectCode=${subject}&username=${localStorage.getItem('username')}`, {
            method: "POST",
            body: JSON.stringify(questions),
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response: Response) => response.json())
            .then(() => {
                navigate(`/user/post/mock-test`);
            })

    }

    const downloadTemplate = () => {
        const fileName = 'questions.xlsx';
        const data = [{
            content: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            correct: "",
        }];

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'test');

        XLSX.writeFile(wb, fileName);
    }

    return <>
        <Modal opened={opened} onClose={close} title="Import instruction">
            <Text size="sm">
                <Divider my="md"/>
                The system only accept excel (.xlsx) files. File must <b>strictly</b> be in the following format:
                <Space h="sm"></Space>
                <img src="/src/asset/excelFileFormat.png" alt=""/>
                <Space h="sm"></Space>
                <Space h="sm"></Space>
                <b>Strictly</b> means it must in the <b>exact</b> same format with the picture (the same column name and
                no extra columns).
                <Space h="sm"></Space>

                Please <Text td="underline" color="blue" component="button" type="button" onClick={downloadTemplate}>download
                the template</Text> for easier use.
                <Space h="sm"></Space>
                <Space h="sm"></Space>
                <Divider my="md"/>
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

                            <Space h="md"/>

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

                            <Space h="md"/>

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
                            <Text c="dimmed" size="xs">Only accept excel files. Import format instruction <Text
                                td="underline" color="blue" component="button" onClick={open}>here</Text></Text>
                            <Text c="dimmed" size="xs">Download template <Text td="underline" color="blue" type="button"
                                                                               component="button"
                                                                               onClick={downloadTemplate}>here</Text></Text>

                            <Space h="xs"/>

                            <Grid>
                                <Grid.Col span={6}>
                                    <Button color="red" variant="outline" onClick={() => navigate("/home")} mt="md">
                                        Back
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Button onClick={handleAdd} mt="md">
                                        Create
                                    </Button>
                                </Grid.Col>
                            </Grid>

                            <Text size="xs" color="red">{errorAll}</Text>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    </>
}