import {useState} from "react";
import {Grid, Drawer, Burger} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import TableSubject from "../../component/manage-subject/TableSubject";

export default function ManageSubjectPage() {
    const isSmallScreen = useMediaQuery("(max-width: 1100px)");
    const isMediumScreen = useMediaQuery("(max-width: 1024px)");
    const [drawerOpened, setDrawerOpened] = useState(false);

    const handleBurgerClick = () => {
        setDrawerOpened((prev) => !prev);
    };

    return (
        <>
            <Grid>
                <Grid.Col span={10} offset={1}>
                    <TableSubject/>
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
}
