import {ReactElement} from "react";

import {Home} from "../../../../module/home/page/Home.tsx";
import {User} from "../../../../module/user/page/Users.tsx";
import {Modules} from "../../../../module/modules/page/Modules.tsx";
import {NoPermissionPage} from "../../../../utils/pages/NoPermissionPage.tsx";
import {Customers} from "../../../../module/customer/page/Customers.tsx";
import {Me} from "../../../auth/page/Me.tsx";
import {Wallets} from "../../../../module/wallet/page/Wallets.tsx";
import {Product} from "../../../../module/product/page/Product.tsx";

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
    {
        path: "/customers",
        element: <Customers/>,
        permissionRequired: true
    },
    {
        path: "/wallets",
        element: <Wallets/>,
        permissionRequired: true
    },
    {
        path: "/me",
        element: <Me/>,
        permissionRequired: false
    },
    {
        path: "/products",
        element: <Product/>,
        permissionRequired: true
    }
]