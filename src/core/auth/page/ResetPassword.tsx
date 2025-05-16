import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {Box, Button, Divider, FormControl, FormHelperText, FormLabel, Stack, Typography} from "@mui/joy";
import {LoginRounded, StoreRounded} from "@mui/icons-material";
import {Fragment} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {authUseCase} from "../usecase/AuthUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {useQuery} from "../../../utils/hooks/useQuery.ts";
import {Navigate, useNavigate} from "react-router-dom";
import {PasswordInput} from "../../../utils/components/inputs/PasswordInput.tsx";
import {useTranslation} from "react-i18next";
import {ToggleThemeButton} from "../../../utils/components/theme/ToggleThemeMode.tsx";
import {ToggleLanguageButton} from "../../../i18n/components/ToggleLanguageButton.tsx";

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
    const {t} = useTranslation()

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
                popup.toast("success", t('reset_password_page.success_message'), 2000)
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
            <Typography component="h1" level="h3">{t('reset_password_page.title')}</Typography>
            <FormControl>
                <FormLabel>{t('reset_password_page.new_password_label')}</FormLabel>
                <PasswordInput
                    {...register("newPassword", {required: "The password is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.newPassword?.message as string}
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>{t('reset_password_page.confirm_new_password_label')}</FormLabel>
                <PasswordInput
                    {...register("confirmPassword", {required: "The confirmation of password is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.confirmPassword?.message as string}
                </FormHelperText>
            </FormControl>
            <Button startDecorator={<LoginRounded/>} type={"submit"}>
                {t('reset_password_page.submit_button')}
            </Button>
        </Box>
    )
}