import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {Box, Button, Divider, FormControl, FormHelperText, FormLabel, Link, Typography} from "@mui/joy";
import {CheckCircleOutlineRounded, LoginRounded, StoreRounded} from "@mui/icons-material";
import {Fragment, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {authUseCase} from "../usecase/AuthUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";

export const ForgottenPassword = () => {
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
                        <ForgottenForm/>
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

const ForgottenForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();

    const [checkMail, setCheckMail] = useState(false);

    const handleSubmitForgotten = handleSubmit((data: FieldValues) => {
        authUseCase.forgotPassword(data.email).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000)
            } else {
                setCheckMail(true);
            }
        })
    });

    if (checkMail) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center"
                }}
            >
                <CheckCircleOutlineRounded fontSize={"large"} color={"success"}/>
                <Typography component="h1" level="h3">Request sent</Typography>
                <Typography component="h6" color="neutral">Check your email inbox</Typography>
                <Link level={"title-md"} href={"/app/login"} sx={{mt: 5}}>Back to login page</Link>
            </Box>
        );
    }

    return (
        <Box
            component={"form"}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
            onSubmit={handleSubmitForgotten}
        >
            <Typography component="h1" level="h3">Reset password</Typography>
            <Typography component="h6" color="neutral">
                After submitting the request, you will receive a link in your email inbox to continue resetting your
                password.
            </Typography>
            <FormControl>
                <FormLabel>Inform your email</FormLabel>
                <TextInput
                    {...register("email", {required: "The email is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.email?.message as string}
                </FormHelperText>
            </FormControl>
            <Button startDecorator={<LoginRounded/>} type={"submit"}>Submit reset</Button>
            <Box display={"flex"} justifyContent={"center"}>
                <Link level={"title-md"} href={"/app/login"}>Back to login page</Link>
            </Box>
        </Box>
    )
}