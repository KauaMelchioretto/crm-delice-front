import {ReactElement} from "react";

import {Home} from "../../../../module/home/page/Home.tsx";
import {User} from "../../../../module/user/page/Users.tsx";
import {Modules} from "../../../../module/modules/page/Modules.tsx";
import {NoPermissionPage} from "../../../../utils/pages/NoPermissionPage.tsx";

interface Route {
    element?: ReactElement,
    path: string,
    permissionRequired: boolean
}

export const routes: Route[] = [
    {
        path: "/home",
        element: <Home/>,
        permissionRequired: false
    },
    {
        path: "/user",
        element: <User/>,
        permissionRequired: true
    },
    {
        path: "/modules",
        element: <Modules/>,
        permissionRequired: true
    },
    {
        path: "/noPermission",
        element: <NoPermissionPage/>,
        permissionRequired: false
    },
]