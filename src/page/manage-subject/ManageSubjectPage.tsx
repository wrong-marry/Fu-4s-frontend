import { useState } from "react";
import { Grid, Drawer, Burger } from "@mantine/core";
import { NavbarNested } from "../../component/manageUser/navbar-nested/navbar-nested";
import { useMediaQuery } from "@mantine/hooks";
import TableSubject from "../../component/manage-subject/TableSubject";

export default function ManageSubjectPage() {
	const isSmallScreen = useMediaQuery("(max-width: 1100px)");
	const isMediumScreen = useMediaQuery("(max-width: 1024px)");
	const [drawerOpened, setDrawerOpened] = useState(false);

	const handleBurgerClick = () => {
		setDrawerOpened((prev) => !prev);
	};

<<<<<<< Updated upstream
  return (
    <>
      <Grid>
        <Grid.Col span={isSmallScreen ? 12 : isMediumScreen ? 3 : 2.6}>
          {isSmallScreen ? (
            <Burger opened={drawerOpened} onClick={handleBurgerClick} />
          ) : (
            <></>
          )}
        </Grid.Col>
        <Grid.Col span={isSmallScreen ? 12 : isMediumScreen ? 9 : 9}>
          <TableSubject />
        </Grid.Col>
      </Grid>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        padding="md"
        size="100%"
      >
      </Drawer>
    </>
  );
=======
	return (
		<>
			<Grid>
				<Grid.Col span={isSmallScreen ? 12 : isMediumScreen ? 3 : 2.6}>
					{isSmallScreen ? (
						<Burger opened={drawerOpened} onClick={handleBurgerClick} />
					) : (
						<NavbarNested />
					)}
				</Grid.Col>
				<Grid.Col span={isSmallScreen ? 12 : isMediumScreen ? 9 : 9}>
					<TableSubject />
				</Grid.Col>
			</Grid>

			<Drawer
				opened={drawerOpened}
				onClose={() => setDrawerOpened(false)}
				padding="md"
				size="100%"
			>
				<NavbarNested />
			</Drawer>
		</>
	);
>>>>>>> Stashed changes
}
