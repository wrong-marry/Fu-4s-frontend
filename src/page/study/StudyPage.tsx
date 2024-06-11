import {Center, Container, Title} from "@mantine/core";
import Object2 from "../../component/subject-posting/Subject.button.tsx";
import Object3 from "../../component/subject-posting/Semester.button.tsx";
import React from "react";


export default function StudyPage() {
    return (
        <Container fluid>
            <Object2/>
            <Object3/>
        </Container>) as React.ReactElement;
}