import {useNavigate, useSearchParams} from "react-router-dom";
import {
    Question,
} from "../../component/question/QuestionDetail";
import {fetchRandomQuestion} from "../../util/QuestionUtil";
import {useEffect, useRef, useState} from "react";
import {
    Affix,
    Badge,
    Button,
    Center,
    Flex,
    Grid,
    Group,
    Modal,
    Paper,
    RingProgress,
    Text,
    Title,
    Transition,
    rem,
} from "@mantine/core";
import {useWindowScroll} from "@mantine/hooks";
import {IconArrowUp, IconCheck} from "@tabler/icons-react";
import {format} from "date-fns";
import axios, {AxiosResponse} from "axios";
import {Post} from "../post/PostPage";
import TestQuestion from "../../component/question/TestQuestion";
import {HeroText} from "../../component/hero-text/HeroText";
import {ProgressCardColored} from "../../component/progress-card/ProgressCard";
import TestScore from "../../component/test-mark/TestScore";

interface Result {
    correctAnswersId: number[];
    wrongAnswersId: number[];
}

export default function TakingTestPage() {
    const [searchParam,] = useSearchParams();
    const id = searchParam.get("id");
    const numberOfQuestion = searchParam.get("number-of-questions");
    const mode = searchParam.get("mode");
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [scroll, scrollTo] = useWindowScroll();
    const [post, setPost] = useState<Post | null>(null);
    const [numberOfQuestionChecked, setNumberOfQuestionsChecked] = useState(0);
    const bottom = useRef<HTMLElement | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [reviewing, setReviewing] = useState(false);
    const [submitFormOpened, setSubmitFormOpened] = useState(false);
    const [congratulationOpened, setCongratulationOpened] = useState(false);
    const [correctAnswersId, setCorrectAnswersId] = useState<number[]>([]);
    const [wrongAnswersId, setWrongAnswersId] = useState<number[]>([]);
    const [result, setResult] = useState<Result | null>(null);
    const [displayProgress, SetDisplayProgress] = useState<boolean>(true);
    let questionIndex = 0;
    const personalized = () => {
        if (mode === "personalized") return true;
        else if (mode === "random") return false;
        else throw new Response("Wrong mode", {status: 404});
    };

    const addToCorrectAnswers = (id: number) => {
        setCorrectAnswersId([...correctAnswersId, id]);
        setWrongAnswersId(wrongAnswersId.filter((i) => i != id));
    };

    const addToWrongAnswers = (id: number) => {
        setWrongAnswersId([...wrongAnswersId, id]);
        setCorrectAnswersId(correctAnswersId.filter((i) => i != id));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (id != null && numberOfQuestion != null) {
                const res = await fetchRandomQuestion(
                    id,
                    Number(numberOfQuestion),
                    personalized()
                );
                setQuestions(res.data);
                const idsArray: number[] = res.data.map(
                    (question: Question) => question.id
                );
                setWrongAnswersId(idsArray);
            } else navigate("/forbidden");
        };
        const fetchPost = async () => {
            try {
                const response: AxiosResponse<Post> = await axios.get(
                    `http://3.27.235.175:8080/api/v1/post/get?id=${id}`
                );
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchPost();
        fetchData();
        personalized();
    }, []);

    const increaseNumberOfQuestionsChecked = () => {
        setNumberOfQuestionsChecked(numberOfQuestionChecked + 1);
    };

    const decreaseNumberOfQuestionsChecked = () => {
        setNumberOfQuestionsChecked(numberOfQuestionChecked - 1);
    };

    const modifyNumberOfCorrectAnswers = (isAdd: boolean) => {
        isAdd
            ? setCorrectAnswers(correctAnswers + 1)
            : setCorrectAnswers(correctAnswers - 1);
    };

    const questionsDisplay = questions.map((question: Question) => {
        ++questionIndex;
        return (
            <TestQuestion
                reviewing={reviewing}
                key={question.id}
                question={question}
                questionIndex={questionIndex}
                modifyNumberOfCorrectAnswers={modifyNumberOfCorrectAnswers}
                increaseNumberOfQuestionsChecked={increaseNumberOfQuestionsChecked}
                decreaseNumberOfQuestionsChecked={decreaseNumberOfQuestionsChecked}
                addToCorrectAnswers={addToCorrectAnswers}
                addToWrongAnswers={addToWrongAnswers}
            />
        );
    });
    const date = () => {
        if (post != null)
            return format(new Date(post.postTime), "dd/MM/yyyy HH:mm");
        else return "";
    };

    const saveTestResult = async () => {
        await axios.post(
            `http://3.27.235.175:8080/api/v1/test-result/save?score=${
                (correctAnswers * 10) / Number(numberOfQuestion)
            }&username=${localStorage.getItem(
                "username"
            )}&questionSetId=${id}&isPersonalized=${personalized()}`
        );
    };

    const increaseAttempts = async () => {
        await axios.put(
            `http://3.27.235.175:8080/api/v1/questionSet/increase-attempts?id=${id}`
        );
    };

    const handleClickSubmit = () => {
        setResult({
            correctAnswersId: correctAnswersId,
            wrongAnswersId: wrongAnswersId,
        });
        setSubmitFormOpened(true);
        SetDisplayProgress(false);
    };

    const handleSubmit = async () => {
        if (personalized()) {
            await axios.put(
                `http://3.27.235.175:8080/api/v1/question-priority/update?username=${localStorage.getItem(
                    "username"
                )}`,
                result
            ).catch(err => console.log(err));
            console.log(result);
        }
        setSubmitFormOpened(false);
        setCongratulationOpened(true);
        setReviewing(true);
        scrollTo({y: 0});
        saveTestResult();
        increaseAttempts();
    };

    return (
        <>
            <Modal
                transitionProps={{transition: "slide-up", duration: 1000}}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 2,
                }}
                opened={submitFormOpened}
                onClose={() => {
                    setSubmitFormOpened(false);
                    SetDisplayProgress(true);
                }}
                title="Test submission"
                centered
                size="lg"
            >
                <Title order={5}>
                    You have finished{" "}
                    <Text c="blue" span inherit>
                        {numberOfQuestionChecked}
                    </Text>{" "}
                    out of {numberOfQuestion}
                </Title>
                <Text>
                    Do you want to{" "}
                    <Text c="red" span inherit>
                        {numberOfQuestionChecked != Number(numberOfQuestion)
                            ? "go back and continue doing the test"
                            : "go back and change your answers"}
                    </Text>{" "}
                    or{" "}
                    <Text c="blue" span inherit>
                        submit the test
                    </Text>{" "}
                </Text>
                <Flex mt="md" gap="xs" justify="flex-end">
                    <Button bg="red" onClick={() => setSubmitFormOpened(false)}>
                        Back to test
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </Flex>
            </Modal>

            <Modal
                transitionProps={{transition: "rotate-left", duration: 1000}}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 6,
                }}
                opened={congratulationOpened}
                onClose={() => setCongratulationOpened(false)}
                centered
                size="lg"
                withCloseButton={false}
                radius="md"
            >
                <Title order={3}> Congratulations!</Title>
                <Flex my="lg" justify="center">
                    <iframe
                        className="rounded-lg"
                        allow="fullscreen"
                        frameBorder="0"
                        height="320"
                        src="https://giphy.com/embed/gyfKwCIVXrM17qIVsY/video"
                        width="480"
                    ></iframe>
                </Flex>

                <Text my="md">
                    Well done! You have finished the test. Your result is stored in your{" "}
                    <Text c="pink" span inherit>
                        Test History
                    </Text>
                    . Now you can click the{" "}
                    <Text c="blue" span inherit>
                        Continue
                    </Text>{" "}
                    button to view your result and review the questions{" "}
                </Text>
                <Flex justify="flex-end">
                    <Button
                        radius="md"
                        onClick={() => setCongratulationOpened(false)}
                        right="xs"
                    >
                        Continue
                    </Button>
                </Flex>
            </Modal>

            <Grid display={Flex} justify="center">
                <Grid.Col span={{base: 12, md: 8}}>
                    <Flex justify="center" direction="column" align="center">
                        <Badge my={15} variant="filled" size="lg">
                            Mock Test
                        </Badge>
                        <Button
                            display={reviewing ? "block" : "none"}
                            bg="red"
                            radius="xl"
                            onClick={() => navigate(`/post/${id}`)}
                        >
                            Go back to question set
                        </Button>
                    </Flex>
                    <Title order={2} className="text-3xl font-md" ta="center" my={30}>
                        {post?.title}
                    </Title>

                    <Grid>
                        <Grid.Col span={4}>
                            <Badge color="pink" size="lg">
                                Test Mode
                            </Badge>
                        </Grid.Col>
                        <Grid.Col span={7}>
                            <Group justify="end" align="center">
                                <Badge color="pink" size="lg">
                                    Created by {post?.username}
                                </Badge>
                                <Badge color="purple" size="lg">
                                    {date()}
                                </Badge>
                            </Group>
                        </Grid.Col>
                    </Grid>
                    <Grid display={reviewing ? "block" : "none"}>
                        <Grid.Col span={6}>
                            <Paper withBorder radius="lg" p="lg" my="md" shadow="lg">
                                <Group>
                                    <RingProgress
                                        size={80}
                                        thickness={8}
                                        sections={[
                                            {
                                                value:
                                                    (correctAnswers * 100) / Number(numberOfQuestion),
                                                color: "green",
                                            },
                                        ]}
                                        rootColor="red"
                                        label={
                                            <Center>
                                                <IconCheck
                                                    style={{width: rem(20), height: rem(20)}}
                                                    stroke={1.5}
                                                />
                                            </Center>
                                        }
                                    />

                                    <div>
                                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                            Number of correct answers
                                        </Text>
                                        <Text fw={700} size="xl">
                                            {correctAnswers} / {numberOfQuestion}
                                        </Text>
                                    </div>
                                </Group>
                            </Paper>
                        </Grid.Col>
                        <Grid.Col my="md" span={6}>
                            <TestScore
                                questionSetId={id}
                                personalized={personalized}
                                correctAnswers={correctAnswers}
                                numberOfQuestion={numberOfQuestion}
                            />
                        </Grid.Col>
                    </Grid>
                    <>{questionsDisplay}</>
                </Grid.Col>
            </Grid>
            <Group display={reviewing ? "none" : "block"}>
                <HeroText handleSubmit={() => handleClickSubmit()}/>
            </Group>
            <section ref={bottom}></section>
            <Affix position={{bottom: 20, right: 20}}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={
                                <IconArrowUp style={{width: rem(16), height: rem(16)}}/>
                            }
                            style={transitionStyles}
                            onClick={() => scrollTo({y: 0})}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
            <Affix
                display={reviewing ? "none" : displayProgress ? "block" : "none"}
                position={{top: 150, right: 20}}
            >
                <ProgressCardColored
                    handleSubmit={() => handleClickSubmit()}
                    numberOfQuestion={numberOfQuestion}
                    numberOfQuestionChecked={numberOfQuestionChecked}
                />
            </Affix>
        </>
    );
}
