import {Group, Paper, Text, ThemeIcon} from "@mantine/core";
import {IconArrowDownRight, IconArrowUpRight} from "@tabler/icons-react";
import classes from "./StatsGridIcons.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../common/constant.tsx";

export default function TestScore(prop: any) {
    const [lastScore, setLastScore] = useState(0);
    const score = Number(
        ((prop.correctAnswers * 10) / prop.numberOfQuestion).toFixed(1)
    );

    useEffect(() => {
        const fetchLastScore = async () => {
            const result = await axios.get(
                `${BASE_URL}/api/v1/test-result/get-last-score?username=${localStorage.getItem(
                    "username"
                )}&questionSetId=${prop.questionSetId}`
            );
            setLastScore(result.data);
        };

        fetchLastScore();
    }, [prop.reviewing]);
    const stats = () => {
        const DiffIcon =
            score - lastScore > 0 ? IconArrowUpRight : IconArrowDownRight;
        return (
            <Paper withBorder p="md" radius="lg" shadow="lg">
                <Group justify="apart">
                    <div>
                        <Text
                            c="dimmed"
                            tt="uppercase"
                            fw={700}
                            fz="xs"
                            className={classes.label}
                        >
                            You scored
                        </Text>
                        <Text fw={700} fz="xl">
                            {score} / 10
                        </Text>
                    </div>
                    <ThemeIcon
                        color="gray"
                        variant="light"
                        style={{
                            color:
                                score - lastScore > 0
                                    ? "var(--mantine-color-teal-6)"
                                    : "var(--mantine-color-red-6)",
                        }}
                        size={38}
                        radius="md"
                    >
                        <DiffIcon size="1.8rem" stroke={1.5}/>
                    </ThemeIcon>
                </Group>
                <Text c="dimmed" fz="sm" mt="md">
                    <Text
                        component="span"
                        c={score - lastScore > 0 ? "teal" : "red"}
                        fw={700}
                    >
                        {score - lastScore} points
                    </Text>{" "}
                    {score - lastScore > 0 ? "increase" : "decrease"} compared to last
                    attempt
                </Text>
            </Paper>
        );
    };

    return <div className={classes.root}>{stats()}</div>;
}
