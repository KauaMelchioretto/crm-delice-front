import {useAuth} from "../../../auth/provider/AuthProvider.tsx";
import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

export const Middleware = (
    {children, authRequired}: { children: ReactNode, authRequired: boolean }
) => {
    const {authenticated} = useAuth()

    if (authRequired && !authenticated) {
        return <Navigate to={"/login"}/>
    }

    return children;
}