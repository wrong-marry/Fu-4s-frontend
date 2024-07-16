import { Container, Title, Text, Button, Group } from "@mantine/core";
import classes from "./ServerOverload.module.css";
import { Illustration } from "./Illustration";
import { useNavigate } from "react-router-dom";

export function BannedPage() {
	const navigate = useNavigate();
	return (
		<div className={classes.root}>
			<Container>
				<div className={classes.inner}>
					<Illustration className={classes.image} />
					<div className={classes.content}>
						<Title className={classes.title}>YOU ARE BANNED</Title>
						<Text size="lg" ta="center" className={classes.description}>
                            Your account has been banned. Please contact the administrator for more information.
                        </Text>
						<Group justify="center">
							<Button onClick={() => navigate("/")} size="md" variant="white">
								Go to landing page
							</Button>
						</Group>
					</div>
				</div>
			</Container>
		</div>
	);
}
