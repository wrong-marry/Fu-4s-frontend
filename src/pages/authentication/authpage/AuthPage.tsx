import axios from "axios";
import AuthForm from "../../../components/authentication/Login/AuthForm";
import { redirect } from "react-router-dom";
import {
	assignLoginPayload,
	assignRegisterPayload,
} from "../../../utils/loader/auth/auth";
import { toast } from "react-toastify";

function AuthPage() {
	return <AuthForm />;
}
export default AuthPage;
export async function action({ request }: { request: any }) {
	try {
		const searchParams = new URL(request.url).searchParams;
		const mode = searchParams.get("mode") || "login";
		const data = await request.formData();
		const formField = Object.fromEntries(data);
		let payload: any = {};
		let api: string = "authenticate";

		if (mode !== "login" && mode !== "register") {
			throw new Error("Unsupported mode");
		}

		if (mode === "login") {
			payload = assignLoginPayload(formField);
		} else if (mode === "register") {
			payload = assignRegisterPayload(formField);
			api = "register";
		}

		const apiUrl = `${BASE_URL}/auth/login`;
		const fetchedData = await axios
			.post(apiUrl, payload)
			.then((res) => res.data)
			.catch((err) => err.response.data);

		let errorFieldExtracted: string[] | null = [];

		if (mode === "register" && fetchedData?.error) {
			fetchedData.data.forEach((e: any) => {
				if (e.fieldName) {
					errorFieldExtracted!.push(e.fieldName);
				}
			});
			return {
				error: true,
				message: fetchedData.data[0]?.errorMessage || "Something went wrong",
				errorField: errorFieldExtracted,
			};
		}

		if (mode === "login" && fetchedData?.error) {
			fetchedData.data[0]?.fieldName?.forEach((e: any) => {
				if (e) {
					errorFieldExtracted!.push(e);
				}
			});
			return {
				error: true,
				message: fetchedData.data[0]?.errorMessage || "Something went wrong",
				errorField: errorFieldExtracted,
			};
		}

		if (mode === "login") {
			if (fetchedData?.banned) {
				return {
					error: true,
					message: "You have been banned from our platform.",
				};
			} else {
				sessionStorage.setItem("RT", fetchedData.refreshToken);
				localStorage.setItem("AT", fetchedData.accessToken);
				localStorage.setItem("uid", fetchedData.userId);
				return redirect("/home");
			}
		} else if (mode === "register") {
			if (fetchedData?.accessToken) {
				toast.success("Registered successfully, please login");
				return redirect("/auth?mode=login");
			} else {
				return {
					error: true,
					message: "Something went wrong with us, be patient!",
				};
			}
		}
	} catch (error) {
		return {
			error: true,
			message: "Something went wrong with us, be patient!",
		};
	}
}
