import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AuthProvider} from "../../auth/provider/AuthProvider.tsx";
import {DefaultPage} from "./default/DefaultPage.tsx";
import {Middleware} from "./middleware/Middleware.tsx";
import {LoginPage} from "../../auth/page/LoginPage.tsx";
import {ForgottenPassword} from "../../auth/page/ForgottenPassword.tsx";
import {ResetPassword} from "../../auth/page/ResetPassword.tsx";
import {useApp} from "../app/AppProvider.tsx";
import {loadCampaign} from "../../../module/campaign/entities/entities.ts";
import {ErrorPage} from "../../../utils/pages/ErrorPage.tsx";
import {LeadCampaignPage} from "../../../module/lead/page/LeadCampaignPage.tsx";
import {LeadRegisteredWithSuccess} from "../../../module/lead/page/LeadRegisteredWithSuccess.tsx";

export const Root = () => {
    const {crmModules} = useApp()

    const router = createBrowserRouter(
        [

            {
                path: "/login",
                element: (
                    <AuthProvider>
                        <LoginPage/>
                    </AuthProvider>
                ),
            },
            {
                path: "/forgotten",
                element: <ForgottenPassword/>,
            },
            {
                path: "/resetPassword",
                element: <ResetPassword/>,
            },
            {
                path: "/visit/:uuid",
                loader: loadCampaign,
                element: <LeadCampaignPage/>,
                errorElement: <ErrorPage/>,
                HydrateFallback: () => (
                    <div>Carregando requisição…</div>
                ),
            },
            {
                path: "/success",
                element: <LeadRegisteredWithSuccess/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/",
                element: (
                    <AuthProvider>
                        <DefaultPage/>
                    </AuthProvider>
                ),
                children: crmModules.map((x, i) => ({
                    path: x.path,
                    element: (
                        <Middleware
                            key={`page_key_${i}`}
                            permissionRequired={x.permissionRequired}
                            path={x.path}
                        >
                            {x.element}
                        </Middleware>
                    ),
                })),
            },
        ],
        {
            basename: "/app",
        }
    );

    return (
        <RouterProvider
            router={router}
        />
    )
};
