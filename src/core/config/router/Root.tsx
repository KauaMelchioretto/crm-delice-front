import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "../../auth/provider/AuthProvider.tsx";
import {DefaultPage} from "./default/DefaultPage.tsx";
import {Middleware} from "./middleware/Middleware.tsx";
import {LoginPage} from "../../auth/page/LoginPage.tsx";
import {ForgottenPassword} from "../../auth/page/ForgottenPassword.tsx";
import {ResetPassword} from "../../auth/page/ResetPassword.tsx";
import {useApp} from "../app/AppProvider.tsx";

export const Root = () => {
    const {crmModules} = useApp()

    return (
        <BrowserRouter basename={"/app"}>
            <Routes>
                <Route
                    path={"/login"}
                    element={
                        <AuthProvider>
                            <LoginPage/>
                        </AuthProvider>
                    }
                />
                <Route
                    path={"/forgotten"}
                    element={
                        <ForgottenPassword/>
                    }
                />
                <Route
                    path={"/resetPassword"}
                    element={
                        <ResetPassword/>
                    }
                />
                <Route
                    path={""}
                    element={
                        <AuthProvider>
                            <DefaultPage/>
                        </AuthProvider>
                    }
                >
                    {
                        crmModules.map(
                            (x, i) => (
                                <Route
                                    path={x.path}
                                    element={
                                        <Middleware
                                            permissionRequired={x.permissionRequired}
                                            path={x.path}
                                        >
                                            {x.element}
                                        </Middleware>
                                    }
                                    key={`page_key_${i}`}
                                />
                            )
                        )
                    }
                </Route>
            </Routes>
        </BrowserRouter>
    )
};
