import {LoginPage} from "../../../auth/page/LoginPage.tsx";
import {ReactElement} from "react";

interface Route {
    path?: string,
    element?: ReactElement,
    authRequired: boolean
}

export const routes: Route[] = [
    {
        path: "/login",
        element: <LoginPage/>,
        authRequired: false
    },
    {
        path: "/home",
        element: <LoginPage/>,
        authRequired: true
    },
]