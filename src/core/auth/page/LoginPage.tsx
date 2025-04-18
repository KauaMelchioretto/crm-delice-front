import {FieldValues, useForm} from "react-hook-form";
import {Box, Button, Divider, FormControl, FormHelperText, FormLabel, Link, Typography} from "@mui/joy";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {PasswordInput} from "../../../utils/components/inputs/PasswordInput.tsx";
import {useAuth} from "../provider/AuthProvider.tsx";
import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {Fragment} from "react";
import {LoginRounded, StoreRounded} from "@mui/icons-material";

export const LoginPage = () => {
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
                        <LoginForm/>
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
                <FormLabel>Your login</FormLabel>
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
                <FormLabel>Your password</FormLabel>
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
            <Box display={"flex"} justifyContent={"center"}>
                <Link level={"title-md"} href={"/app/forgotten"}>Did you forgotten your password?</Link>
            </Box>
        </Box>
    );
}