import {
    TextInput,
    Paper,
    Title,
    Container,
    Button,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import {useEffect, useState} from "react";
import {emptyUser, fetchUser} from "../../../util/UserFetchUtil";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {isEmail, useForm} from "@mantine/form";

export function UpdateProfileForm() {
    const [user, setUser] = useState(emptyUser);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
        },

        validate: {
            email: isEmail("Invalid email"),
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchUser();
            setUser(res.data);

            form.setFieldValue("email", res.data.email);
            form.setFieldValue("firstName", res.data.firstName);
            form.setFieldValue("lastName", res.data.lastName);
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!form.isValid()) return;
        const newData = {...user, ...form.getValues()};
        await axios
            .put(
                "http://localhost:8080/api/v1/user/edit-profile?username=" +
                user.username,
                newData
            )
            .catch((err) => console.log(err));
        navigate("/user");
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Edit Your Profile!
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form
                    onSubmit={
                        //async (e) =>
                        //e.preventDefault();
                        form.onSubmit(() => {
                        })
                    }
                >
                    <TextInput
                        mb={20}
                        onChange={(e) => {
                            //setUser({ ...user, email: e.target.value });
                            form.setFieldValue("email", e.currentTarget.value);
                        }}
                        label="Email"
                        placeholder="your email"
                        value={form.values.email}
                        error={form.errors.email && "Invalid email"}
                        required
                        radius="md"
                    />
                    <TextInput
                        my={20}
                        onChange={(e) => {
                            form.setFieldValue("firstName", e.currentTarget.value);
                        }}
                        label="First Name"
                        value={form.values.firstName}
                        placeholder={"your first name"}
                        key={form.key("firstName")}
                        required
                    />
                    <TextInput
                        my={20}
                        onChange={(e) => {
                            form.setFieldValue("lastName", e.currentTarget.value);
                        }}
                        label="Last Name"
                        value={form.values.lastName}
                        placeholder="your last name"
                        key={form.key("lastName")}
                        required
                    />
                    <Button type="submit" fullWidth mt="xl" onClick={handleSubmit}>
                        Update Profile
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
