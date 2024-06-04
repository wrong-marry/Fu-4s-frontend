import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { NavigationProgress } from "@mantine/nprogress";
import '@mantine/notifications/styles.css';
// Supports weights 300-800
import "@fontsource-variable/open-sans";
import UserCredentialsProvider from "./store/user-credentials-context.tsx";
// import StudyModeProvider from "./store/study-mode-context.tsx";
// import QuizInfoProvider from "./store/quiz-info-context.tsx";
import {Notifications} from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals";
const theme = {
  fontFamily: "Open Sans Variable, Helvetica, sans-serif",
  headings: {
    fontFamily: "Open Sans Variable, sans-serif",
  },
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider defaultColorScheme="light" theme={theme}>
    <ModalsProvider>

    <NavigationProgress />
        <UserCredentialsProvider>
          <Notifications limit={4}/>
            <App />

        </UserCredentialsProvider>
    </ModalsProvider>
  </MantineProvider>
);
