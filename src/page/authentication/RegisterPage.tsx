import { useForm } from '@mantine/form';
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage(props: PaperProps) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: ''
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      username: (val) => (val.length < 6 ? 'Username should include at least 6 characters' : null),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  async function register() {
    setError('')
    form.validate();
    if(!form.isValid()) return;

    const data = form.getValues();
    
    if(confirmPassword != data.password) {
      setError('Password does not match');
      return; 
    }

    await fetch('http://localhost:8080/api/v1/auth/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Set content type to JSON
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('username', data.username);
        localStorage.setItem('token', data.token);
        navigate("/home");
      })
      .catch((e) => {
        setError((e as Error).message)
      });
  }

  return <>
    <Container size="40vw">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to FU-4S, Register your account
        </Text>


        <Divider label="" labelPosition="center" my="lg" />

        <form>
          <Stack>

            <TextInput
              required
              label="Username"
              placeholder="Enter your username"
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username && 'Invalid username'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              radius="md"
            />

            <TextInput
              required
              label="First Name"
              placeholder="Enter your first name"
              onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
              error={form.errors.firstName && 'Invalid first name'}
              radius="md"
            />

            <TextInput
              required
              label="Last Name"
              placeholder="Enter your last name" 
              onChange={(event) => form.setFieldValue('lastName', event.currentTarget.value)}
              error={form.errors.lastName && 'Invalid last name'}
              radius="md"
            />

            <TextInput
              required
              label="Email"
              placeholder="Enter your email" 
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

          </Stack>

          <Text c="red" size="sm" fw={500}>
            {error}
          </Text>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => navigate("/auth/login")} size="xs">
              Already have an account? Log in
            </Anchor>
            <Button radius="xl" onClick={register}>
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  </>;
}