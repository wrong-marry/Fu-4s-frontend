import axios from "axios";

export const fetchQuestion = async (questionSetId:string) => {
    
    const api = `http://localhost:8080/api/v1/question/get-by-question-set-id?questionSetId=${questionSetId}`;
    const questions = await axios.get(api);
    return questions;
  };
  export const fetchRandomQuestion = async (questionSetId:string,numberOfQuestions:number,isPersonalized:boolean) => {
    
    const api = `http://localhost:8080/api/v1/question/get-by-question-set-id/random?questionSetId=${questionSetId}&numberOfQuestions=${numberOfQuestions}&isPersonalized=${isPersonalized}`;
    const questions = await axios.get(api);
    return questions;
  };
