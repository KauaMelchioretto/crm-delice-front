import {Outlet} from "react-router-dom";
import Layout from "../../../../utils/layout/Layout.tsx";
import {MenuSide} from "../../../../utils/components/menuside/MenuSide.tsx";
import {StoreRounded} from "@mui/icons-material";
import {Box, Stack, Typography} from "@mui/joy";
import {Fragment, useContext} from "react";
import {ToggleThemeButton} from "../../../../utils/components/theme/ToggleThemeMode.tsx";
import {ToggleLanguageButton} from "../../../../i18n/components/ToggleLanguageButton.tsx";

export const DefaultPage = () => (
    <Layout.Root>
        <Content/>
    </Layout.Root>
);

const Content = () => {
    const {show} = useContext(Layout.RootContext)

    return (
        <Fragment>
            {
                show && (
                    <Fragment>
                        <Layout.Header>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Stack direction={"row"} alignItems={"center"} gap={1}>
                                    <StoreRounded color={"action"}/>
                                    <Typography level={"title-md"} color={"neutral"}>
                                        Delice CRM
                                    </Typography>
                                </Stack>
                                <Stack direction={"row"} alignItems={"center"} gap={1}>
                                    <ToggleThemeButton/>
                                    <ToggleLanguageButton/>
                                </Stack>
                            </Box>
                        </Layout.Header>
                        <Layout.SideNav>
                            <MenuSide/>
                        </Layout.SideNav>
                    </Fragment>
                )
            }
            <Layout.Main>
                <Outlet/>
            </Layout.Main>
        </Fragment>
    )
}