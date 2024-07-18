import {
	createBrowserRouter,
	redirect,
	RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";

import React, { Suspense } from "react";
import { Box, LoadingOverlay } from "@mantine/core";

import Root from "./page/Root";
import LandingPage from "./page/landing-page/LandingPage";
import RegisterPage from "./page/authentication/RegisterPage";
import ForgotPasswordPage from "./page/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./page/authentication/ResetPasswordPage";
import HomePage from "./page/home/HomePage";
import { ErrorPage } from "./page/404/ErrorPage";
import UserProfilePage from "./page/user-profile/UserProfilePage";
import UpdateProfilePage from "./page/user-profile/UpdateProfilePage";
import ManageUser from "./page/manageUser-page/ManageUserPage";
import { ChangePassWordForm } from "./component/user-profile/change-password/ChangePassWordForm";
import { getAuthCredentials, isLoggedIn, Logout } from "./util/loader/Auth";
import { ForbiddenPage } from "./page/403/ForbiddenPage";
import StudyPage from "./page/study/StudyPage.tsx";
import SearchPage from "./page/search/SearchPage.tsx";
import PostPage from "./page/post/PostPage.tsx";
import LearningMaterialDetail from "./component/user-post/learning-material/LearningMaterialDetail.tsx";
import NotificationList from "./component/notification/NotificationList.tsx";

import { UserPostPage } from "./page/user-post/UserPostPage.tsx";
import { UserLearningMaterialPage } from "./page/user-post/learning-material/UserLearningMaterialPage.tsx";
import { UserMockTestPage } from "./page/user-post/mock-test/UserMockTestPage.tsx";
import ManageSubjectPage from "./page/manage-subject/ManageSubjectPage.tsx";
import TakingTestPage from "./page/mock-test-detail-page/TakingTestPage.tsx";


import CreateMockTestPage from "./page/user-post/mock-test/CreateMockTestPage.tsx";
import EditMockTestPage from "./page/user-post/mock-test/EditMockTestPage.tsx";
import ManagePostForStaff from "./page/manage-post-forstaff/ManagePostPage.tsx";

import TestResultPage from "./page/test-result/TestResultPage.tsx";

import { AddLearningMaterialPage } from "./page/user-post/learning-material/AddLearningMaterialPage.tsx";
import { EditLearningMaterialPage } from "./page/user-post/learning-material/EditLearningMaterialPage.tsx";
import LoginPage from "./page/authentication/LoginPage.tsx";
import { BannedPage } from "./page/banned/banned.tsx";

import PostsListBySubject from "./page/list/PostListBySubject.tsx";
import SubjectsListBySemester from "./page/list/SubjectsListBySemester.tsx";

export const loadingIndicator = (
	<Box pos={"relative"} h={"100vh"} w={"100vw"}>
		<LoadingOverlay
			visible
			zIndex={0}
			overlayProps={{ radius: "sm", blur: 0, backgroundOpacity: 0 }}
			loaderProps={{ color: "blue", type: "oval" }}
		/>
	</Box>
);

const router = createBrowserRouter([
	{
		path: "test",
		element: (
			<Suspense fallback={loadingIndicator}>
				<TakingTestPage />
			</Suspense>
		),
	},

	{
		path: "/",
		loader: getAuthCredentials,
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				index: true,
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
				path: "post/:id",
				element: (
					<Suspense fallback={loadingIndicator}>
						<PostPage />
					</Suspense>
				),
			},
			{
				path: "semester/:semester",
				element: (
					<Suspense fallback={loadingIndicator}>
						<SubjectsListBySemester />
					</Suspense>
				),
			},
			{
				path: "subject/:code",
				element: (
					<Suspense fallback={loadingIndicator}>
						<PostsListBySubject />
					</Suspense>
				),
			},
			{
				path: "learning-material/:id",
				element: (
					<Suspense fallback={loadingIndicator}>
						<LearningMaterialDetail />
					</Suspense>
				),
			},
			{
				path: "notifications",
				element: (
					<Suspense fallback={loadingIndicator}>
						<NotificationList />
					</Suspense>
				),
			},
			{
				path: "study",
				element: <StudyPage />,
			},
			{
				path: "change-password",
				element: <ChangePassWordForm />,
			},
			{
				path: "logout",
				element: <Suspense fallback={loadingIndicator}></Suspense>,
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
						loader: async () => {
							if (isLoggedIn()) return redirect("/home");
							else return "";
						},
						element: (
							<Suspense fallback={loadingIndicator}>
								<LoginPage />
							</Suspense>
						),
					},
					{
						path: "register",
						loader: async () => {
							if (isLoggedIn()) return redirect("/home");
							else return "";
						},
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
				children: [
					{
						index: true,
						path: "",
						loader: async () => redirect("/user/profile"),
					},
					{
						path: "profile",
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
						path: "post",
						children: [
							{
								path: "",
								element: (
									<Suspense fallback={loadingIndicator}>
										<UserPostPage />
									</Suspense>
								),
								loader: () => {
									if (!isLoggedIn()) return redirect("/forbidden");
									return null;
								},
							},
							{
								path: "mock-test",
								element: (
									<Suspense fallback={loadingIndicator}>
										<UserMockTestPage />
									</Suspense>
								),
								loader: () => {
									if (!isLoggedIn()) return redirect("/forbidden");
									return null;
								},
							},
							{
								path: "learning-material",
								element: (
									<Suspense fallback={loadingIndicator}>
										<UserLearningMaterialPage />
									</Suspense>
								),
								loader: () => {
									if (!isLoggedIn()) return redirect("/forbidden");
									return null;
								},
							},
						],
					},
				],
			},
			{
				path: "admin",
				children: [
					{
						path: "manage-user",
						loader: async () => {
							if (!isLoggedIn()) return redirect("/forbidden");
							else return "";
						},
						element: (
							<Suspense fallback={loadingIndicator}>
								<ManageUser />
							</Suspense>
						),
					},
					{
						path: "manage-user",
						element: <ManageUser />,
					},
					{
						path: "manage-subject",
						element: <ManageSubjectPage />,
					},
				],
			},
			{
				path: "staff",
				children: [
					{
						path: "manage-post",
						loader: async () => {
							if (!isLoggedIn()) return redirect("/forbidden");
							else return "";
						},
						element: (
							<Suspense fallback={loadingIndicator}>
								<ManagePostForStaff />
							</Suspense>
						),
					},
				],
			},
			{
				path: "update-profile",
				element: (
					<Suspense fallback={loadingIndicator}>
						<UpdateProfilePage />
					</Suspense>
				),
			},
			{
				path: "create-mock-test",
				loader: () => {
					if (!isLoggedIn()) return redirect("/forbidden");
					return null;
				},
				element: (
					<Suspense fallback={loadingIndicator}>
						<CreateMockTestPage />
					</Suspense>
				),
			},
			{
				path: "/test-result",
				element: (
					<Suspense fallback={loadingIndicator}>
						<TestResultPage />
					</Suspense>
				),
			},
			{
				path: "/edit-mock-test/:id",
				loader: () => {
					if (!isLoggedIn()) return redirect("/forbidden");
					return null;
				},
				element: (
					<Suspense fallback={loadingIndicator}>
						<EditMockTestPage />
					</Suspense>
				),
			},
			{
				path: "create-learning-material",
				loader: () => {
					if (!isLoggedIn()) return redirect("/forbidden");
					return null;
				},
				element: (
					<Suspense fallback={loadingIndicator}>
						<AddLearningMaterialPage />
					</Suspense>
				),
			},
			{
				path: "edit-learning-material/:id",
				loader: () => {
					if (!isLoggedIn()) return redirect("/forbidden");
					return null;
				},
				element: (
					<Suspense fallback={loadingIndicator}>
						<EditLearningMaterialPage />
					</Suspense>
				),
			},
			{
				path: "/forbidden",
				element: (
					<Suspense fallback={loadingIndicator}>
						<ForbiddenPage />
					</Suspense>
				),
			},
			{
				path: "/banned",
				element: (
					<Suspense fallback={loadingIndicator}>
						<BannedPage />
					</Suspense>
				),
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
			/>
			<RouterProvider router={router} />
		</>
	) as React.ReactElement;
}

export default App;
