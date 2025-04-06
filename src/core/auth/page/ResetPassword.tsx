import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {Box, Button, Divider, FormControl, FormHelperText, FormLabel, Typography} from "@mui/joy";
import {LoginRounded, StoreRounded} from "@mui/icons-material";
import {Fragment} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {authUseCase} from "../usecase/AuthUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {useQuery} from "../../../utils/hooks/useQuery.ts";
import {Navigate, useNavigate} from "react-router-dom";

export const ResetPassword = () => {
    const isMobile = ["xs", "sm"].includes(useWidth())

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative"
            }}
        >
            <Box display={"flex"} sx={{position: "absolute", top: 10, left: 10, gap: 1}}>
                <StoreRounded color={"action"}/>
                <Typography level={"title-md"} color={"neutral"}>
                    Delice CRM
                </Typography>
            </Box>
            <Box
                sx={{
                    width: `${isMobile ? "100%" : "40%"}`,
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Box sx={{width: "70%"}}>
                        <ResetForm/>
                    </Box>
                </Box>
            </Box>
            {
                !isMobile && (
                    <Fragment>
                        <Divider orientation={"vertical"}/>
                        <Box
                            sx={{
                                width: "60%",
                                display: "flex",
                                alignItems: "start"
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            ></div>
                        </Box>
                    </Fragment>
                )
            }
        </Box>
    )
}

const ResetForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();

    const navigate = useNavigate()

    const token = useQuery().get("token");

    const handleSubmitReset = handleSubmit((data: FieldValues) => {
        authUseCase.resetPassword({
            token: token!,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000)
            } else {
                navigate("/login")
            }
        })
    });

    if (!token) {
        return <Navigate to={"/login"}/>
    }

    return (
        <Box
            component={"form"}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
            onSubmit={handleSubmitReset}
        >
            <Typography component="h1" level="h3">Reset password request</Typography>
            <FormControl>
                <FormLabel>Inform your new password</FormLabel>
                <TextInput
                    {...register("newPassword", {required: "The password is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.newPassword?.message as string}
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Confirm your new password</FormLabel>
                <TextInput
                    {...register("confirmPassword", {required: "The confirmation of password is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.confirmPassword?.message as string}
                </FormHelperText>
            </FormControl>
            <Button startDecorator={<LoginRounded/>} type={"submit"}>Submit reset</Button>
        </Box>
    )
}