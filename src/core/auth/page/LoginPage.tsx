import {FieldValues, useForm} from "react-hook-form";
import {Box, Button, Divider, FormControl, FormHelperText, FormLabel, Typography} from "@mui/joy";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {PasswordInput} from "../../../utils/components/inputs/PasswordInput.tsx";
import {useAuth} from "../provider/AuthProvider.tsx";
import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {Fragment} from "react";
import {LoginRounded} from "@mui/icons-material";

export const LoginPage = () => {
    const isMobile = ["xs", "sm"].includes(useWidth())

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex"
            }}
        >
            <Box
                sx={{
                    p: 2,
                    width: `calc(${isMobile ? "100%" : "40%"} - 32px)`,
                    height: "calc(100% - 32px)",
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
                        <LoginForm/>
                    </Box>
                </Box>
            </Box>
            {
                !isMobile && (
                    <Fragment>
                        <Divider orientation={"vertical"}/>
                        <Box sx={{width: "60%"}}>
                            <div></div>
                        </Box>
                    </Fragment>
                )
            }
        </Box>
    )
}

export const LoginForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const {login} = useAuth();

    const handleLogin = handleSubmit((data: FieldValues) => {
        login(data?.login ?? "", data?.password ?? "")
    })

    return (
        <Box
            component={"form"}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
            onSubmit={handleLogin}
        >
            <Typography component="h1" level="h3">Sign In</Typography>
            <Typography component="h6" color="neutral">Welcome back!</Typography>
            <FormControl>
                <FormLabel>Login</FormLabel>
                <TextInput
                    {...register("login", {required: "The login is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.login?.message as string}
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <PasswordInput
                    {...register("password", {required: "The password is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.password?.message as string}
                </FormHelperText>
            </FormControl>
            <Button startDecorator={<LoginRounded/>} type={"submit"}>sign in</Button>
        </Box>
    );
}