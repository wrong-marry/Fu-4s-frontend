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
  } from '@mantine/core';
  import classes from './AuthenticationTitle.module.css';
  
  export function UpdateProfileForm() {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Edit Your Profile!
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={handleSubmit}>
          <TextInput label="Email" placeholder="youremail@gmail.com" required />
          <TextInput label="First Name" placeholder="Thai" required />
          <TextInput label="Last Name" placeholder="Hieu" required />
          <Button fullWidth mt="xl">
            Update Profile
          </Button>
          </form>
        </Paper>
      </Container>
    );
  }