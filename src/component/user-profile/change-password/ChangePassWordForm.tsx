import {
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";

export function ChangePassWordForm() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const compareAPI =
        "http://localhost:8080/api/v1/user/compare-password?username=" +
        username +
        "&confirmPassword=";
    const changePassAPI = "http://localhost:8080/api/v1/user/change-password?username=" + username + "&newPassword=";
    const form = useForm({
        initialValues: {
            oldPassWord: "",
            newPassWord: "",
            confirmPassword: "",
        },

        validate: {
            newPassWord: (val) =>
                val.length < 6 ? "Password should include at least 6 characters" : null,
            confirmPassword: (val, values) =>
                val != values.newPassWord ? "New password does not match" : null,
        },
    });

    const handleSubmit = async () => {
        if (!form.isValid()) return;
        const newData = form.getValues();
        const isSimilarPassword = await axios
            .get(compareAPI + newData.oldPassWord)
            .then((res) => res.data)
            .catch((err) => console.log(err));
        if (!isSimilarPassword) {
            form.setFieldError("oldPassWord", "Wrong password");
            return;
        }
        await axios.put(changePassAPI + newData.newPassWord).catch((err) => console.log(err));
        // await axios
        //   .put(
        //     "http://localhost:8080/api/v1/user/edit-profile?username=" +
        //       user.username,
        //     newData
        //   )
        //   .catch((err) => console.log(err));
        notifications.show({
            title: "Password Changed successfully",
            message: "You are now back to your profile page"
        })
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
                    <PasswordInput
                        required
                        label="Old Password"
                        placeholder="Your password"
                        value={form.values.oldPassWord}
                        onChange={(event) =>
                            form.setFieldValue("oldPassWord", event.currentTarget.value)
                        }
                        error={
                            form.errors.oldPassWord &&
                            "Wrong password"
                        }
                        radius="md"
                    />
                    <PasswordInput
                        required
                        label="New Password"
                        placeholder="New password"
                        value={form.values.newPassWord}
                        onChange={(event) =>
                            form.setFieldValue("newPassWord", event.currentTarget.value)
                        }
                        error={
                            form.errors.newPassWord &&
                            "Password should include at least 6 characters"
                        }
                        radius="md"
                    />
                    <PasswordInput
                        required
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                        value={form.values.confirmPassword}
                        onChange={(event) =>
                            form.setFieldValue("confirmPassword", event.currentTarget.value)
                        }
                        error={form.errors.confirmPassword && "New password does not match"}
                        radius="md"
                    />
                    <Button type="submit" fullWidth mt="xl" onClick={handleSubmit}>
                        Update password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
