import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "../../auth/provider/AuthProvider.tsx";
import {DefaultPage} from "./default/DefaultPage.tsx";
import {routes} from "./routes/Routes.tsx";
import {Middleware} from "./middleware/Middleware.tsx";

export const Root = () => (
    <BrowserRouter basename={"/app"}>
        <Routes>
            <Route
                path={""}
                element={
                    <AuthProvider>
                        <DefaultPage/>
                    </AuthProvider>
                }
            >
                {
                    routes.map(
                        (x, i) => (
                            <Route
                                path={x.path}
                                element={
                                    <Middleware
                                        authRequired={x.authRequired}
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
);
