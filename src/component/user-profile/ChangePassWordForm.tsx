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
import { emptyUser, fetchUser } from "../../util/UserFetchUtil";
  
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
        email: (val) => (/^\S+@\S+$/.test(val) ? null : "Ivalid email"),
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
      const newData = { ...user, ...form.getValues() };
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
              form.onSubmit(() => {})
            }
          >
            <PasswordInput
            required
            label="Old Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
            <Button type="submit" fullWidth mt="xl" onClick={handleSubmit}>
              Update Profile
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }
  