import {
	createBrowserRouter,
	Navigate,
	redirect,
	RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";
import { lazy, Suspense } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import Root from "./page/Root";
import LandingPage from "./page/landing-page/LandingPage";
import LoginPage from "./page/authentication/LoginPage";
import RegisterPage from "./page/authentication/RegisterPage";
import ForgotPasswordPage from "./page/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./page/authentication/ResetPasswordPage";
import HomePage from "./page/home/HomePage";
import { ErrorPage } from "./page/404/ErrorPage";
import QuestionPage from "./page/question-page/QuestionPage";
import UserProfilePage from "./page/user-profile/UserProfilePage";
import LearningMaterialDetailPage from "./page/learning-material-detail/LearningMaterialDetailPage";
import UpdateProfilePage from "./page/user-profile/UpdateProfilePage";
import ManageUser from "./page/manageUser-page/ManageUserPage";
import { ChangePassWordForm } from "./component/user-profile/change-password/ChangePassWordForm";
import { isLoggedIn, Logout } from "./util/loader/Auth";
import { ForbiddenPage } from "./page/403/ForbiddenPage";
import { getAuthCredentials} from "./util/loader/Auth";
import StudyPage from "./page/study/StudyPage.tsx";
import SearchPage from "./page/search/SearchPage.tsx";

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
		loader: getAuthCredentials,
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				index:true,
				element: <LandingPage />,
			},
			{
				path: "home",
				element: <HomePage />,
			},
			{
				path: "search",
				element: (
					<Suspense fallback={loadingIndicator}>
						<SearchPage />
					</Suspense>
				),
			},
			{
				path: "study",
				element: <StudyPage />,
			},
			{
				path: "subject-posting",
				element: <QuestionPage />,
			},
			{
				path: "manage-user",
				element: <ManageUser />,
			},
			{
				path: "change-password",
				element: <ChangePassWordForm />,
			},
			{
				path: "logout",
				loader: Logout,
			},
			{
				path: "auth",
				children: [
					{
						index: true,
						path: "",
						loader: async () => redirect("/auth/login"),
					},
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
			{
				path: "user",
				element: (
					<Suspense fallback={loadingIndicator}>
						<UserProfilePage />
					</Suspense>
				),
				loader: () => {
					if (!isLoggedIn()) return redirect("/forbidden");
					return null;
				},
			},
			{
				path: "update-profile",
				element: (
					<Suspense fallback={loadingIndicator}>
						<UpdateProfilePage />
					</Suspense>
				),
			},
		],
	},
	{
		path: "/forbidden",
		element: (
			<Suspense fallback={loadingIndicator}>
				<ForbiddenPage />
			</Suspense>
		),
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
			/>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
