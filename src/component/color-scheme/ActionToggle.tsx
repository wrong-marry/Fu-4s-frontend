import {ActionIcon, FileButton, Group} from '@mantine/core';
import {IconCamera} from '@tabler/icons-react';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../common/constant.tsx";

export function ActionToggle() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>('');
    const isImageFile = (file: File) => {
        const allowedExtensions = ['.png', '.jpeg']
        const fileName = file.name
        const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
        return allowedExtensions.includes(fileExtension)

    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target == null) {
            setError("Invalid file! Only accept Excel file!")
            throw new Error("Invalid");
        }
        const formData = new FormData();
        formData.append('image', file ?? "");

        axios.post(`${BASE_URL}/api/v1/user/avatar?username=` + localStorage.getItem("username"), formData, {
            onUploadProgress: (e) => {
                console.log((e?.progress ?? 0) * 100);
            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            }
        }).then(res => console.log(res.data))
            .catch(e => console.log(e));
    };
    useEffect(() => {
        if (file == null) {
            console.log("null file");
            return;
        }
        if (!isImageFile(file)) {
            setError("Invalid file! Only accept PNG or JPEG file!");
            console.log(error);
            return;
        }

        reader.readAsArrayBuffer(file);
        setError(null);
    }, [file])

    return (
        <Group justify="center">

            <ActionIcon
                variant="default"
                size="xl"
                aria-label="Change avatar"
            >
                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                    {(props) => {
                        console.log(file?.name);
                        return <IconCamera {...props}/>
                    }
                    }
                </FileButton>
            </ActionIcon>
        </Group>
    ) as React.ReactElement;
}