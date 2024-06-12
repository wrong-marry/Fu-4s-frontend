import {Container} from "@mantine/core";
import StudyComponentOne from "../../component/subject-posting/Subject.button.tsx";
import PostTypeTab from "../../component/subject-posting/PostTypeTab.tsx";
import React from "react";


export default function StudyPage() {
    return (
        <Container fluid>
            <StudyComponentOne/>
            <PostTypeTab/>
        </Container>) as React.ReactElement;
}