import {ReactElement} from "react";

import { Home } from "../../../../module/home/page/Home.tsx";

interface Route {
    path?: string,
    element?: ReactElement,
    authRequired: boolean
}

export const routes: Route[] = [
    {
        path: "/home",
        element: <Home/>,
        authRequired: true
    },
]