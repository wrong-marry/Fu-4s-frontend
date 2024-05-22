import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
//import Root from "./pages/Root";
import { ToastContainer } from "react-toastify";
// cuu data
import "react-toastify/dist/ReactToastify.css";

// import Homepage from "./pages/guest/homepage/Homepage";
// import { action as authAction } from "./pages/authentication/authpage/AuthPage";
// import logout from "./utils/loader/auth/logout";
// import {
//   checkAuth,
//   getAuthCredentials,
//   isLoggedIn,
//   preventAuth,
// } from "./utils/loader/auth/auth";
import "@mantine/core/styles.css";
// import { ErrorPage } from "./pages/errorpage/ErrorPage";
// import {
//   forgotPasswordAction,
//   resetPasswordAction,
// } from "./utils/action/forgot-password/ForgotPasswordAction";
// import {
//   loader as SetLoader,
//   action as SetAction,
// } from "./pages/quiz/set/SetDetails";
// import StudyModeRoot from "./pages/study-mode/StudyModeRoot";
// import { loader as FlashcardLoader } from "./pages/study-mode/flashcard/FlashcardPage";
// import { action as NavbarAction } from "./pages/Root";
import { lazy, Suspense } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import Root from "./page/Root";
import ErrorPage from "./page/404/ErrorPage";
import LandingPage from "./page/landing-page/LandingPage";
import LoginPage from "./page/authentication/LoginPage";
import RegisterPage from "./page/authentication/RegisterPage";
import ForgotPasswordPage from "./page/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./page/authentication/ResetPasswordPage";
import HomePage from "./page/home/HomePage";
// import LearnPage from "./pages/study-mode/learn/LearnPage";
// import { createQuizAction } from "./pages/quiz/create_form/CreateQuizPage";
// import ClassQuestionPage, {
//   classQuestionPageAction,
//   classQuestionPageLoader,
// } from "./pages/class/ClassQuestionPage";
// import { classAction, classLoader } from "./pages/class/ClassPage";
// import { folderPageAction, folderPageLoader } from "./pages/folder/FolderPage";
// import {
//   UpdateQuizSetAction,
//   UpdateQuizSetLoader,
// } from "./pages/quiz/update/UpdateQuizSet";
// import { settingsAction } from "./pages/settings/SettingsPage";

// const AuthPage = lazy(() => import("./pages/authentication/authpage/AuthPage"));
// const ForgotPassword = lazy(
//   () => import("./pages/authentication/forgot-password/ForgotPassword")
// );
// const ResetPassword = lazy(
//   () => import("./pages/authentication/forgot-password/ResetPassword")
// );
// const UserDashboard = lazy(() => import("./pages/after_login/UserDashboard"));
// const UserDashboard = lazy<React.ComponentType<any>>(() => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(import("./pages/after_login/UserDashboard")), 0);
//   });
// });

// const ProfilePage = lazy(() => import("./pages/account/user/ProfilePage"));

// const ClassPage = lazy(() => import("./pages/class/ClassPage"));
// const CreateQuizPage = lazy(
//   () => import("./pages/quiz/create_form/CreateQuizPage")
// );

// const FolderPage = lazy(() => import("./pages/folder/FolderPage"));
// const SetDetails = lazy(() => import("./pages/quiz/set/SetDetails"));
// const FlashcardMode = lazy(
//   () => import("./pages/study-mode/flashcard/FlashcardPage")
// );

// const Settings = lazy(() => import("./pages/settings/SettingsPage"));
// const UpdateQuizSet = lazy(() => import("./pages/quiz/update/UpdateQuizSet"));
// const ClassInvitation = lazy(() => import("./pages/class/ClassInvitationPage"));
export const loadingIndicator = (
  <Box pos={"relative"} h={"100vh"} w={"100vw"}>
    <LoadingOverlay
      visible
      zIndex={0}
      overlayProps={{ radius: "sm", blur: 0, backgroundOpacity: 0 }}
      loaderProps={{ color: "orange", type: "oval" }}
    />
  </Box>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "auth",
        loader: async () => redirect("/auth/login"),
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={loadingIndicator}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: "register",
            element: (
              <Suspense fallback={loadingIndicator}>
                <RegisterPage />
              </Suspense>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <Suspense fallback={loadingIndicator}>
                <ForgotPasswordPage />
              </Suspense>
            ),
          },
          {
            path: "reset-password",
            element: (
              <Suspense fallback={loadingIndicator}>
                <ResetPasswordPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
        stacked
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
