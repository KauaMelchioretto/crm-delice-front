import {createContext, ReactNode, useContext, useState} from "react";
import {LoginResponse} from "../entities/entities.ts";
import {authUseCase} from "../usecase/AuthUseCase.ts";
import {useNavigate} from "react-router-dom";

interface AuthProps {
    authenticated: boolean,
    login?: (login: string, password: string) => void,
    logout?: () => void
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
    const [props, setProps] = useState(initProps);

    const navigate = useNavigate();

    const login = (login: string, password: string) => {
        authUseCase.login({login, password}).then((response: LoginResponse) => {
            if (response.token) {
                setProps({
                    authenticated: true
                });
            }
        })
    }

    const logout = () => {
        authUseCase.logout().then((response) => {
            if (response.ok) {
                navigate("/app/login")
            }
        })
    }

    const value = {...props, login, logout}

    return (
        <AuthContext.Provider value={value}>
            {params.children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext)
}