import {Post} from "../search/SearchPage";
import { Card, Image, Text, Group, RingProgress } from '@mantine/core';
import classes from './CardWithStats.module.css';

const stats = [
    { title: 'Uploader', value: 'UserABC' },
    { title: 'Posted on', value: '2024/5/25' },
    { title: 'Subject', value: 'SWP391' },
];

export function CardWithStats() {
    const items = stats.map((stat) => (
        <div key={stat.title}>
            <Text size="xs" color="dimmed">
                {stat.title}
            </Text>
            <Text fw={500} size="sm">
                {stat.value}
            </Text>
        </div>
    ));

    return (
        <Card withBorder padding="lg" className={classes.card}>
            <Card.Section>
                <Image
                    src="https://cdn.shortpixel.ai/spai/w_600+q_lossy+ret_img+to_webp/thesocialmediamonthly.com/wp-content/uploads/2018/01/quiz.jpg"
                    alt="Running challenge"
                    height={100}
                />
            </Card.Section>

            <Group justify="space-between" mt="xl">
                <Text fz="sm" fw={700} className={classes.title}>
                    Running challenge
                </Text>
                <Group gap={5}>
                    <Text fz="xs" c="dimmed">
                        80% completed
                    </Text>
                    <RingProgress size={18} thickness={2} sections={[{ value: 80, color: 'blue' }]} />
                </Group>
            </Group>
            <Text mt="sm" mb="md" c="dimmed" fz="xs">
                56 km this month • 17% improvement compared to last month • 443 place in global scoreboard
            </Text>
            <Card.Section className={classes.footer}>{items}</Card.Section>
        </Card>
    );
}
export default function PostPage() {
    return <>
        <Card>
        <CardWithStats/>
        </Card>
    </>
}