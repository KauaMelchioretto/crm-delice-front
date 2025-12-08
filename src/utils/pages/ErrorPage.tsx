import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import {CrmNotFound} from "../components/core/CrmNotFound.tsx";
import {CrmContainer} from "../components/core/CrmContainer.tsx";
import {CrmError} from "../components/core/CrmError.tsx";

export const ErrorPage = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CrmNotFound/>
                </CrmContainer>
            )
        }
    }

    return (
        <CrmContainer
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }}
        >
            <CrmError/>
        </CrmContainer>
    )
}