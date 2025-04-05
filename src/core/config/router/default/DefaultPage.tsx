import {Outlet} from "react-router-dom";
import Layout from "../../../../utils/layout/Layout.tsx";
import {MenuSide} from "../../../../utils/components/menuside/MenuSide.tsx";

export const DefaultPage = () => (
    <Layout.Root>
        <Layout.Header>
            <div>CRM - Delice</div>
        </Layout.Header>
        <Layout.SideNav>
            <MenuSide/>
        </Layout.SideNav>
        <Layout.Main>
            <Outlet/>
        </Layout.Main>
    </Layout.Root>
);