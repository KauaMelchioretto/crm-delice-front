import {FieldValues, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, Link, Stack, Typography} from "@mui/joy";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {PasswordInput} from "../../../utils/components/inputs/PasswordInput.tsx";
import {useAuth} from "../provider/AuthProvider.tsx";
import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {LoginRounded, StoreRounded} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {LoginContainer} from "../components/LoginContainer.tsx";
import {LoginCard} from "../components/LoginCard.tsx";
import {ToggleThemeButton} from "../../../utils/components/theme/ToggleThemeMode.tsx";
import {ToggleLanguageButton} from "../../../i18n/components/ToggleLanguageButton.tsx";

export const LoginPage = () => {
    const isMobile = ["xs", "sm"].includes(useWidth())

    return (
        <LoginContainer
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                p: 0,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 10,
                    pl: 2,
                    pr: 2,
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <StoreRounded color={"action"}/>
                    <Typography level={"title-md"} color={"neutral"}>
                        Delice CRM
                    </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <ToggleThemeButton/>
                    <ToggleLanguageButton/>
                </Stack>
            </Box>
            {
                isMobile ? (
                    <LoginForm/>
                ) : (
                    <LoginCard variant={"outlined"}>
                        <LoginForm/>
                    </LoginCard>
                )
            }
        </LoginContainer>
    )
}

export const LoginForm = () => {
    const {t} = useTranslation();

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
            <Typography component="h1" level="h3">{t('login_title')}</Typography>
            <Typography component="h6" color="neutral">{t('login_welcome')}</Typography>
            <FormControl>
                <FormLabel>{t('your_login_input')}</FormLabel>
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
                <FormLabel>{t('your_password_input')}</FormLabel>
                <PasswordInput
                    {...register("password", {required: "The password is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.password?.message as string}
                </FormHelperText>
            </FormControl>
            <Button startDecorator={<LoginRounded/>} type={"submit"}>{t('login_access_input')}</Button>
            <Box display={"flex"} justifyContent={"center"}>
                <Link level={"title-md"} href={"/app/forgotten"}>{t('forget_password_label')}</Link>
            </Box>
        </Box>
    );
}