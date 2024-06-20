import {EditLearningMaterialForm} from "../../../component/user-post/learning-material/EditLearningMaterialForm.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {isValidUser} from "../../../util/ValidUser.tsx";

export function EditLearningMaterialPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    isValidUser(localStorage.getItem("username"), id)
        .then((res) => {
            if(res.status != 200) navigate("/forbidden");
            return res.json();
        })
        .then((data) => {
            if(data == false) navigate("/forbidden");
        })

    return <EditLearningMaterialForm/>
}