import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {AuthenticatedResponse, LoginResponse, LogoutResponse, Module} from "../entities/entities.ts";
import {authUseCase} from "../usecase/AuthUseCase.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {popup} from "../../../utils/alerts/Popup.ts";
import {Box, CircularProgress} from "@mui/joy";

interface AuthProps {
    user?: Record<string, string>,
    modules?: Module[],
    authenticated: boolean,
    login: (login: string, password: string) => void,
    logout: () => void
}

const initProps: AuthProps = {
    authenticated: false,
    login: () => {
    },
    logout: () => {
    }
}

const AuthContext = createContext<AuthProps>(initProps)

interface AuthProviderParams {
    children: ReactNode
}

export const AuthProvider = (params: AuthProviderParams) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [data, setData] = useState<AuthenticatedResponse>();
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        setLoading(true);
        authUseCase.authenticated().then((response) => {
            setData(response);
            setLoading(false);
        })
    }, [location, update]);

    const login = (login: string, password: string) => {
        authUseCase.login({login, password}).then((response: LoginResponse) => {
            if (response.token) {
                setUpdate(prev => !prev);
                navigate("/home");
            }
            if (response.error) {
                popup.toast("error", response.error as string, 2000);
            }
        })
    }

    const logout = () => {
        authUseCase.logout().then((response: LogoutResponse) => {
            if (response.ok) {
                setUpdate(prev => !prev);
                navigate("/login")
            } else {
                popup.toast("error", response.error as string, 2000);
            }
        })
    }

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    const value = {
        login,
        logout,
        authenticated: !(data?.error),
        user: data?.user,
        modules: data?.modules
    }

    return (
        <AuthContext.Provider value={value}>
            {params.children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}