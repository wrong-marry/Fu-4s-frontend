import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from "@mantine/core";
  import classes from "./AuthenticationTitle.module.css";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { useForm } from "@mantine/form";
import { emptyUser, fetchUser } from "../../../util/UserFetchUtil";
  
  export function ChangePassWordForm() {
    const [user, setUser] = useState(emptyUser);
    const navigate = useNavigate();
  
    const form = useForm({
      initialValues: {
        oldPassWord: "",
        newPassWord: "",
        confirmPassword: "",
      },
  
      validate: {
        oldPassWord: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
        newPassWord: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
        confirmPassword: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null)
      },
    });
    useEffect(() => {
      const fetchData = async () => {
        const res = await fetchUser();
        setUser(res.data);
      };
      fetchData();
    }, []);
  
    const handleSubmit = async () => {
      if (!form.isValid()) return;
      const newData = form.getValues();
      // await axios
      //   .put(
      //     "http://localhost:8080/api/v1/user/edit-profile?username=" +
      //       user.username,
      //     newData
      //   )
      //   .catch((err) => console.log(err));
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
              form.onSubmit(() => {})
            }
          >
            <PasswordInput
            required
            label="Old Password"
            placeholder="Your password"
            value={form.values.oldPassWord}
            onChange={(event) => form.setFieldValue('oldPassWord', event.currentTarget.value)}
            error={form.errors.oldPassWord && 'Password should include at least 6 characters'}
            radius="md"
          />
          <PasswordInput
            required
            label="New Password"
            placeholder="New password"
            value={form.values.newPassWord}
            onChange={(event) => form.setFieldValue('newPassWord', event.currentTarget.value)}
            error={form.errors.newPassWord && 'Password should include at least 6 characters'}
            radius="md"
          />
          <PasswordInput
            required
            label="Confirm New Password"
            placeholder="Confirm your password"
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.confirmPassword && 'Password should include at least 6 characters'}
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
  