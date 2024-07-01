import {
    Center,
    Grid,
    Paper,
    SegmentedControl,
    Table,
    Text,
    Title,
} from "@mantine/core";
import axios from "axios";
import {useEffect, useState} from "react";

interface TestResult {
    id: number;
    result: number;
    date: string;
    username: string;
    questionSet: {
        id: 31;
        title: string;
        subjectCode: string;
    };
}

export default function TestResultPage() {
    const [resultsPersonalized, setResultsPersonalized] = useState<
        TestResult[] | []
    >([]);
    const [resultsRandom, setResultsRandom] = useState<TestResult[] | []>([]);
    const [mode, setMode] = useState("random");

    useEffect(() => {
        const fecthResultRandom = async () => {
            const res = await axios.get(
                `https://api.fu4s.online/api/v1/test-result?username=${localStorage.getItem(
                    "username"
                )}&isPersonalized=false`
            );
            setResultsRandom(res.data);
        };
        const fecthResultPersonalized = async () => {
            const res = await axios.get(
                `https://api.fu4s.online/api/v1/test-result?username=${localStorage.getItem(
                    "username"
                )}&isPersonalized=true`
            );
            setResultsPersonalized(res.data);
        };
        fecthResultPersonalized();
        fecthResultRandom();
    }, []);
    const randomResultTable = resultsRandom.map((result) => (
        <Table.Tr key={result.id}>
            <Table.Td>{result.questionSet.title}</Table.Td>
            <Table.Td>{result.questionSet.subjectCode}</Table.Td>
            <Table.Td c="pink">{result.result.toFixed(1)}</Table.Td>
            <Table.Td>{result.date}</Table.Td>
        </Table.Tr>
    ));
    const personalizedResultTable = resultsPersonalized.map((result) => (
        <Table.Tr key={result.id}>
            <Table.Td>{result.questionSet.title}</Table.Td>
            <Table.Td>{result.questionSet.subjectCode}</Table.Td>
            <Table.Td c="pink">{result.result.toFixed(1)}</Table.Td>
            <Table.Td>{result.date}</Table.Td>
        </Table.Tr>
    ));
    return (
        <>
            <Center>
                <Title order={2}>
                    This is your{" "}
                    <Text component="span" c="pink" inherit>
                        Test History
                    </Text>
                </Title>
            </Center>
            <Grid>
                <Grid.Col span={8} offset={2}>
                    <Paper radius="lg" withBorder shadow="lg" m="md" p="lg" mih="60vh">
                        <SegmentedControl
                            radius="md"
                            m="lg"
                            value={mode}
                            onChange={setMode}
                            data={[
                                {label: "Randomized Tests", value: "random"},
                                {label: "Personalized Tests", value: "personalized"},
                            ]}
                        />
                        <Table
                            verticalSpacing="sm"
                            striped
                            highlightOnHover
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Question set title</Table.Th>
                                    <Table.Th>Subject code</Table.Th>
                                    <Table.Th>Your result</Table.Th>
                                    <Table.Th>Submitted date</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {mode === "random"
                                    ? randomResultTable
                                    : personalizedResultTable}

                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Grid.Col>
            </Grid>
        </>
    );
}
