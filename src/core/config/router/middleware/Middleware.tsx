import {useAuth} from "../../../auth/provider/AuthProvider.tsx";
import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

export const Middleware = (
    {children, permissionRequired, path}: { children: ReactNode, permissionRequired: boolean, path: string }
) => {
    const {authenticated, modules} = useAuth()

    if (!authenticated) {
        return <Navigate to={"/login"}/>
    }

    if(permissionRequired && !modules?.find(x => x.path === path)){
        return <Navigate to={"/noPermission"}/>
    }

    return children;
}