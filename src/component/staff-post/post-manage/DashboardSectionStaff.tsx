import {Card} from "@mantine/core";
import {useEffect, useState} from "react";
import {BASE_URL} from "../../../common/constant.tsx";


interface ComponentProps {
	flag: boolean;
	setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSectionStaff: React.FC<ComponentProps> = ({ flag, setFlag }) => {
	const [numOfPost, setNumOfPost] = useState(0);
	const [numOfHidden, setNumOfHidden] = useState(0);
	const [numOfActive, setNumOfActive] = useState(0);
	const [numOfPending, setNumOfPending] = useState(0);
	const pageSize = 3;

	useEffect(() => {
		const fetchNumOfPost = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await fetch(
					`http://localhost:8080/api/v1/post/getAllPost?pageSize=${pageSize}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setFlag(!flag);
				const data = await response.json();
				setNumOfPost(data.total);
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};

		const fetchNumOfActive = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await fetch(
					`http://localhost:8080/api/v1/staff/getNumEachStatus?status=ACTIVE`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setFlag(!flag);
				const data = await response.json();
				setNumOfActive(data);
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};

		const fetchNumOfHidden = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await fetch(
					`http://localhost:8080/api/v1/staff/getNumEachStatus?status=HIDDEN`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setFlag(!flag);
				const data = await response.json();
				setNumOfHidden(data);
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};

		const fetchNumOfPending = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await fetch(
					`http://localhost:8080/api/v1/staff/getNumEachStatus?status=PENDING_APPROVE`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setFlag(!flag);
				const data = await response.json();
				setNumOfPending(data);
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};

		fetchNumOfActive();
		fetchNumOfHidden();
		fetchNumOfPending();
		fetchNumOfPost();
	}, [flag]);

	return (
		<>
			<div className="container px-4 mx-auto">
				<div className="flex flex-wrap -m-3">
					<div className="container px-4 mx-auto">
						<div className="bg-coolGray-50 py-4">
							<h3 className="text-xl font-bold w-full w-auto p-5">
								QUANTITY STATISTICS
							</h3>
						</div>
						<div className="flex flex-wrap -m-3">
							<div className="w-full md:w-1/2 xl:w-1/4 p-3">
								<Card withBorder radius="lg" shadow="md">
									<div className="flex flex-wrap items-end justify-between">
										<div className="w-auto p-2">
											<h3 className="text-sm text-coolGray-500 font-medium">
												Active Posts
											</h3>
										</div>
									</div>
									<div className="my-7">
										<h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
											{numOfActive}
										</h2>
										<p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full">
											active
										</p>
									</div>
								</Card>
							</div>
							<div className="w-full md:w-1/2 xl:w-1/4 p-3">
								<Card withBorder radius="lg" shadow="md">
									<div className="flex flex-wrap items-end justify-between">
										<div className="w-auto p-2">
											<h3 className="text-sm text-coolGray-500 font-medium">
												Hidden Posts
											</h3>
										</div>
									</div>
									<div className="my-7">
										<h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
											{numOfHidden}
										</h2>
										<p className="text-center max-w-max mx-auto px-2 py-1 text-red-500 font-medium text-xs bg-red-100 rounded-full">
											hidden
										</p>
									</div>
								</Card>
							</div>
							<div className="w-full md:w-1/2 xl:w-1/4 p-3">
								<Card withBorder radius="lg" shadow="md">
									<div className="flex flex-wrap items-end justify-between">
										<div className="w-auto p-2">
											<h3 className="text-sm text-coolGray-500 font-medium">
												Pending Posts
											</h3>
										</div>
									</div>
									<div className="my-7">
										<h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
											{numOfPending}
										</h2>
										<p className="text-center max-w-max mx-auto px-2 py-1 text-yellow-500 font-medium text-xs bg-yellow-100 rounded-full">
											pending ...
										</p>
									</div>
								</Card>
							</div>
							<div className="w-full md:w-1/2 xl:w-1/4 p-3">
								<Card withBorder radius="lg" shadow="md">
									<div className="flex flex-wrap items-end justify-between">
										<div className="w-auto p-2">
											<h3 className="text-sm text-coolGray-500 font-medium">
												ALL
											</h3>
										</div>
									</div>
									<div className="my-7">
										<h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
											{numOfPost}
										</h2>
										<p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full">
											all posts
										</p>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardSectionStaff;
