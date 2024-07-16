import axios from "axios";
import {BASE_URL} from "../common/constant.tsx";

export const fetchQuestion = async (questionSetId: string) => {
    const api = `${BASE_URL}/api/v1/question/get-by-question-set-id?questionSetId=${questionSetId}`;
    const questions = await axios.get(api);
    return questions;
};
export const fetchRandomQuestion = async (
    questionSetId: string,
    numberOfQuestions: number,
    isPersonalized: boolean
) => {
    const api = `${BASE_URL}/api/v1/question/get-by-question-set-id/random?questionSetId=${questionSetId}&numberOfQuestions=${numberOfQuestions}&isPersonalized=${isPersonalized}&username=${localStorage.getItem(
        "username"
    )}`;
    const questions = await axios.get(api);
    return questions;
};
