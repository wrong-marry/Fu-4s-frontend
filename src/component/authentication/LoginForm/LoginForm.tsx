import {useForm} from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Anchor,
    Stack,
    Container
} from '@mantine/core';
import {useState} from 'react';
import './LoginPage.css'

import {useNavigate} from "react-router-dom";
import {loginApi} from '../../../util/AuthenUtils';

export default function LoginForm(props: PaperProps) {
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },

        validate: {
            username: (val) => (val.length < 6 ? 'Username should include at least 6 characters' : null),
            password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    async function login() {
        setError('')
        if (!form.isValid()) return;

        const data = form.getValues();
        const res = await loginApi(data);
        if (res.status != 200) {
            res.text()
                .then((data) => setError(data))
        } else {
            res.json()
                .then((data) => {
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('token', data.token);
                    window.location.replace("/home");
                    // navigate("/home");
                })
        }
    }

    return <>
        <Container size="30vw">
            <Paper radius="md" p="xl" withBorder {...props}>
                <Text size="lg" fw={500}>
                    Welcome to FU-4S
                </Text>


                <Divider label="" labelPosition="center" my="lg"/>

                <form onSubmit={form.onSubmit(() => {
                })}>
                    <Stack>

                        <TextInput
                            required
                            label="Username"
                            placeholder="Enter your username"
                            value={form.values.username}
                            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                            error={form.errors.username && 'Invalid username'}
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

                    </Stack>

                    <Text c="red" size="sm" fw={500}>
                        {error}
                    </Text>

                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" onClick={() => navigate("/auth/register")}
                                size="xs">
                            Don't have an account? Register
                        </Anchor>
                        <Button type="submit" radius="xl" onClick={login}>
                            Login
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    </>
}