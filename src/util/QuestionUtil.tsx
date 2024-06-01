import axios from "axios";

export const fetchQuestion = async (questionSetId:string) => {
    
    const api = `http://localhost:8080/api/v1/question/get-by-question-set-id?questionSetId=${questionSetId}`;
    const questions = await axios.get(api);
    return questions;
  };