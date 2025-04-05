import {ReactElement} from "react";

import {Home} from "../../../../module/home/page/Home.tsx";
import {User} from "../../../../module/user/page/User.tsx";

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
    {
        path: "/user",
        element: <User/>,
        authRequired: true
    },
]