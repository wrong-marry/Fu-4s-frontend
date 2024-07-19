import {
    Badge,
    CloseButton,
    Combobox,
    Group,
    Text,
    TextInput,
    useCombobox,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {IconUser, IconUserStar} from "@tabler/icons-react";
import axios from "axios";
import React, {useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {ActionIcon, rem} from '@mantine/core';
import {IconArrowRight} from '@tabler/icons-react';
import {BASE_URL} from "../../../common/constant.tsx";

interface MaterialResponseData {
    id: number;
    postTime: Date;
    content: string;
    title: string;
    subjectCode: string;
    username: string;
}

interface TestResponseData {
    id: number;
    postTime: Date;
    content: string;
    title: string;
    subjectCode: string;
    username: string;
}

interface ResponseData {
    learningMaterials: MaterialResponseData[];
    tests: TestResponseData[];
}

interface Form {
    keywords: string;
}

export const SEARCH_LOAD_SIZE = 4;
const fetchSearchResultData = async (keywords: string) => {
    try {
        let api = `${BASE_URL}/api/v1/search?keyword=${keywords}`;
        if (["STAFF", "ADMIN"].includes(localStorage.getItem("role") ?? "")) api += `&isStaff=true`;
        api += `&pageSize=${SEARCH_LOAD_SIZE}`;
        const res = await axios.get(api, {headers: localStorage.getItem("token")?{
            "Authorization": "Bearer " + localStorage.getItem("token"),
        }:{}});
        return res.data;
    } catch (error) {
        console.error(error)
    }
};

const GeneralSearchBar = () => {
    const [param] = useSearchParams();
    const search = (keywords: string) => {
        window.location.href = (`/search?keyword=${keywords}`);
    };
    const [resData, setResData] = useState<ResponseData>();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const form = useForm<Form>({
        initialValues: {
            keywords: param.get("keyword") ?? "",
        },
    });

    const fetchData = async () => {
        const data = await fetchSearchResultData(form.values.keywords);
        const limitedData = {
            learningMaterials: data?.data?.learningMaterials?.slice(0, 4) || [],
            tests: data?.data?.tests?.slice(0, 4) || [],
        };
        setResData(limitedData);
    };

    const handleInputChange = (e: React.KeyboardEvent) => {
        if (e && e.key == "Enter") {
            search(form.values.keywords);
            combobox.closeDropdown();
        } else if (form.values.keywords.length === 0) {
            combobox.closeDropdown();
        } else {
            fetchData();
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
        }
    };


    const learningMaterialsData = resData?.learningMaterials?.map((item) => (
        <Combobox.Option value={item.title} key={item.id}>
            <Link to={`/post/${item.id}`}>
                <Group>
                    <Text>{item.title}</Text>
                    <Badge
                        leftSection={<IconUserStar size={14} stroke={1.5}/>}
                        color="violet"
                        variant="light"
                    >{`Uploader: ${item.username}`}</Badge>
                </Group>
            </Link>
        </Combobox.Option> as React.ReactElement
    ));

    const testsData = resData?.tests?.map((item) => (
        <Combobox.Option value={item.title} key={item.id}>
            <Link to={`/post/${item.id}`}>
                <Group>
                    <Text>{item.title}</Text>
                    <Badge
                        leftSection={<IconUser size={14} stroke={1.5}/>}
                        color="orange"
                        variant="light"
                    >{`Uploader: ${item.username}`}</Badge>
                </Group>
            </Link>
        </Combobox.Option>
    ));

    return (
        <>
            <Combobox
                withinPortal={false}
                store={combobox}
                onOptionSubmit={(optionValue) => {
                    form.setFieldValue("keywords", optionValue);
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <TextInput
                        placeholder="Search for tests, learningMaterials, etc."
                        onBlur={() => combobox.closeDropdown()}
                        leftSection={
                            form?.values?.keywords !== "" && (
                                <CloseButton
                                    size="sm"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => {
                                        form.setFieldValue("keywords", "");
                                        combobox.closeDropdown();
                                    }}
                                    aria-label="Clear value"
                                />
                            )
                        }
                        rightSection={
                            <ActionIcon size={32} radius="sm" variant="filled"
                                        onClick={() => search(form.values.keywords)}
                            >
                                <IconArrowRight style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                            </ActionIcon>
                        }
                        onKeyUp={(key) => handleInputChange(key)}
                        {...form.getInputProps("keywords")}
                    />
                </Combobox.Target>
                <Combobox.Dropdown mah={400} className="overflow-y-auto">
                    <Combobox.Group label="LearningMaterials">
                        <Combobox.Options>
                            {resData?.learningMaterials.length !== 0 ? (
                                learningMaterialsData
                            ) : (
                                <Combobox.Empty>Nothing found</Combobox.Empty>
                            )}
                        </Combobox.Options>
                    </Combobox.Group>
                    <Combobox.Group label="Tests">
                        <Combobox.Options>
                            {resData?.tests.length !== 0 ? (
                                testsData
                            ) : (
                                <Combobox.Empty>Nothing found</Combobox.Empty>
                            )}
                        </Combobox.Options>
                    </Combobox.Group>
                </Combobox.Dropdown>
            </Combobox>
        </>
    );
};

export default GeneralSearchBar;
