import {
	Button,
	Center,
	Container,
	FileInput,
	Grid,
	List,
	ListItem,
	Paper,
	Space,
	TextInput,
	Title,
	Text,
	Select,
	Modal,
	Checkbox,
} from "@mantine/core";
import classes from "../../user-profile/update-profile/AuthenticationTitle.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BASE_URL } from "../../../common/constant.tsx";

interface Subject {
	code: string;
	name: string;
	semester: number;
}

interface Material {
	title: string;
	subjectCode: string;
	content: string;
	filenames: string[];
}

export function EditLearningMaterialForm() {
	const navigate = useNavigate();
	const maxSize = 2 * 1024 * 1024 * 1024;

	const { id } = useParams<{ id: string }>();
	const [material, setMaterial] = useState<Material | null>(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [files, setFiles] = useState<File[] | null>(null);
	const [subject, setSubject] = useState<string | null>();
	const [subjectList, setSubjectList] = useState<Subject[]>([]);

	const [removePopup, setRemovePopup] = useState(false);
	const [editPopup, setEditPopup] = useState(false);
	const [deleteAllFiles, setDeleteAllFiles] = useState(false);

	const [error, setError] = useState<string>("");
	const [errorAll, setErrorAll] = useState<string>("");

	useEffect(() => {
		const fetchSubject = async () => {
			try {
				const response = await fetch(`${BASE_URL}/api/v1/subject/getAll`);
				const data = await response.json();
				setSubjectList(data);
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};

		const fetchMaterial = async () => {
			try {
				const response = await fetch(
					`${BASE_URL}/api/v1/learningMaterial/getById?id=${id}`
				);
				const data = await response.json();
				setMaterial(data);
				setSubject(data.subjectCode);
				setTitle(data.title);
				setContent(data.content);
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};
		//console.log(22)
		fetchMaterial();
		fetchSubject();
	}, []);

	var toolbarOptions = [
		["bold", "italic", "underline", "strike"],
		[{ header: 1 }, { header: 2 }],
		[{ align: [] }],
		[{ color: [] }],
		["blockquote", "code-block"],
		[{ direction: "rtl" }],
		[{ script: "sub" }, { script: "super" }], // superscript/subscript
		[{ indent: "-1" }, { indent: "+1" }],
		[{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
		["clean"],
	];
	const module = {
		toolbar: toolbarOptions,
	};

	const handleEditBtn = () => {
		if (title == "" || content == "") {
			setErrorAll("Some fields are required!");
			return;
		}
		setErrorAll("");
		setError("");
		setEditPopup(true);
	};

	const handleEdit = () => {
		const formData = new FormData();
		if (files != null)
			files.forEach((file: File) => {
				formData.append("files", file);
			});

		fetch(
			`${BASE_URL}/api/v1/learningMaterial/edit?title=${title}&content=${content}&username=${localStorage.getItem(
				"username"
			)}&subjectCode=${subject}&id=${id}&deleteAllFiles=${deleteAllFiles}`,
			{
				method: "PUT",
				body: formData,
			}
		).then(() => {
			navigate(`/user/post/learning-material`);
		});
	};

	const handleDownloadNewFile = (file: File) => {
		const url = window.URL.createObjectURL(new Blob([file]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", file.name);

		document.body.appendChild(link);
		link.click();

		// @ts-ignore
		link.parentNode.removeChild(link);
	};

	const handleDownloadOldFile = async (filename: string) => {
		const response = await fetch(
			`${BASE_URL}/api/v1/learningMaterial/getFile?id=${id}&filename=${filename}`
		);
		const file = await response.blob();

		const url = window.URL.createObjectURL(new Blob([file]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", filename);

		document.body.appendChild(link);
		link.click();

		// @ts-ignore
		link.parentNode.removeChild(link);
	};

	const handleSetFiles = (fs: File[]) => {
		var check: boolean = false;
		fs.forEach((f) => {
			if (f.size > maxSize) {
				setError("Files must be smaller than 2GB!");
				check = true;
			}
		});

		if (check) {
			setFiles(null);
			return;
		}

		setError("");
		if (fs.length != 0) setFiles(fs);
		else setFiles(null);
	};

	const handleRemove = () => {
		fetch(
			`${BASE_URL}/api/v1/learningMaterial/remove?id=${id}&username=${localStorage.getItem(
				"username"
			)}`,
			{
				method: "DELETE",
			}
		).then(() => {
			navigate(`/user/post/learning-material`);
		});
	};

	const dataSubject = subjectList.map((subject) => ({
		value: subject.code,
		label:
			subject.code + " - " + subject.name + " - Semester: " + subject.semester,
	}));

	if (material == null) return;

	let listData;
	if (files != null)
		listData =
			files.length == 0 ? (
				<ListItem>
					<i>no files yet</i>
				</ListItem>
			) : (
				files.map((file, index) => {
					return (
						<ListItem key={index} mb="xs">
							<Text
								onClick={() => handleDownloadNewFile(file)}
								td="underline"
								color="blue"
								type="button"
								component="button"
							>
								{file.name}
							</Text>
						</ListItem>
					);
				})
			);
	else
		listData =
			material.filenames.length == 0 ? (
				<ListItem>
					<i>no files yet</i>
				</ListItem>
			) : (
				material.filenames.map((file, index) => {
					return (
						<ListItem key={index} mb="xs">
							<Text
								onClick={() => handleDownloadOldFile(file)}
								td="underline"
								color="blue"
								type="button"
								component="button"
							>
								{file}
							</Text>
						</ListItem>
					);
				})
			);
	return (
		<>
			<Modal
				opened={removePopup}
				onClose={() => setRemovePopup(false)}
				title="Are you sure"
			>
				<Text size="md">
					Are you sure you want to remove this question? The action cannot be
					undone
				</Text>
				<Grid>
					<Grid.Col span={3} offset={5}>
						<Center>
							<Button
								variant="default"
								onClick={() => setRemovePopup(false)}
								mt="sm"
							>
								Cancel
							</Button>
						</Center>
					</Grid.Col>

					<Grid.Col span={4}>
						<Center>
							<Button onClick={handleRemove} mt="sm" color="red">
								Remove
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</Modal>

			<Modal
				opened={editPopup}
				onClose={() => setEditPopup(false)}
				title="Are you sure"
			>
				<Text size="md">
					Are you sure you want to edit this question? The action cannot be
					undone
				</Text>
				<Grid>
					<Grid.Col span={3} offset={5}>
						<Center>
							<Button
								variant="default"
								onClick={() => setEditPopup(false)}
								mt="sm"
							>
								Cancel
							</Button>
						</Center>
					</Grid.Col>

					<Grid.Col span={4}>
						<Center>
							<Button onClick={handleEdit} mt="sm" color="blue">
								Edit
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</Modal>

			<Container size={900} my={40}>
				<Title ta="center" className={classes.title} order={2}>
					Edit Learning Material
				</Title>
				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<form>
						<TextInput
							value={title}
							label="Title"
							description="Your material title"
							placeholder="Enter title"
							onChange={(event) => setTitle(event.currentTarget.value)}
							required
							radius="md"
						/>

						<Space h="lg" />
						<Space h="md" />

						<Select
							label="Subject"
							description="Your material subject"
							value={subject}
							onChange={setSubject}
							data={dataSubject}
							searchable
							required
							disabled
							radius="md"
						/>

						<Space h="lg" />
						<Space h="md" />

						<label
							className="m_8fdc1311 mantine-InputWrapper-label mantine-TextInput-label"
							data-required="true"
							htmlFor="mantine-sjauq2siu"
							id="mantine-sjauq2siu-label"
						>
							Content
							<span
								className="m_78a94662 mantine-InputWrapper-required mantine-TextInput-required"
								aria-hidden="true"
							>
								{" "}
								*
							</span>
						</label>
						<p
							className="m_fe47ce59 mantine-InputWrapper-description mantine-TextInput-description"
							id="mantine-sjauq2siu-description"
						>
							Your material content
						</p>
						<Space h="xs" />
						<ReactQuill
							defaultValue={content}
							modules={module}
							theme="snow"
							onChange={setContent}
							value={content}
							style={{ height: "60vh" }}
						/>

						<Space h="lg" />
						<Space h="md" />

						<Space h="lg" />
						<Space h="lg" />
						<Grid>
							<Grid.Col span={5}>
								<FileInput
									radius="md"
									label="Attached files"
									description="Choose all files at a time. Only accept files < 2GB"
									placeholder="Choose files"
									onChange={(fs) => handleSetFiles(fs)}
									multiple
									clearable
									error={error}
								/>
							</Grid.Col>
						</Grid>
						<Space h="xs" />
						{material.filenames.length > 0 ? (
							<Checkbox
								size="xs"
								checked={deleteAllFiles}
								onChange={(event) =>
									setDeleteAllFiles(event.currentTarget.checked)
								}
								label={"Remove all files"}
								description="This will remove all your attached files"
								color="red"
							/>
						) : (
							<></>
						)}

						<Space h="xs" />

						<List
                        icon="•"
                        withPadding
                        size="sm"
                    >
                        {listData}
                    </List>

						<Space h="lg" />

						<Grid>
							<Grid.Col span={2} offset={6}>
								<Center>
									<Button
										variant="outline"
										color="blue"
										onClick={() => navigate("/user/post/learning-material")}
										ml="lg"
									>
										Back
									</Button>
								</Center>
							</Grid.Col>

							<Grid.Col span={2}>
								<Center>
									<Button
										color="red"
										onClick={() => setRemovePopup(true)}
										ml="lg"
									>
										Remove
									</Button>
								</Center>
							</Grid.Col>

							<Grid.Col span={2}>
								<Center>
									<Button onClick={handleEditBtn} color="blue">
										Edit
									</Button>
								</Center>
							</Grid.Col>
						</Grid>

						<Grid>
							<Grid.Col span={4} offset={8}>
								<Text size="xs" color="red">
									{errorAll}
								</Text>
							</Grid.Col>
						</Grid>
					</form>
				</Paper>
			</Container>
		</>
	);
}
