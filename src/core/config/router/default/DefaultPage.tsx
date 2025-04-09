import {Outlet} from "react-router-dom";
import Layout from "../../../../utils/layout/Layout.tsx";
import {MenuSide} from "../../../../utils/components/menuside/MenuSide.tsx";
import {StoreRounded} from "@mui/icons-material";
import {Box, Typography} from "@mui/joy";
import {Fragment, useContext} from "react";

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
                            <Box display={"flex"} gap={1}>
                                <StoreRounded color={"action"}/>
                                <Typography level={"title-md"} color={"neutral"}>
                                    Delice CRM
                                </Typography>
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