import {useWidth} from "../../../utils/hooks/useWidth.tsx";
import {Box, Button, Divider, FormControl, FormHelperText, FormLabel, Link, Stack, Typography} from "@mui/joy";
import {CheckCircleOutlineRounded, LoginRounded, StoreRounded} from "@mui/icons-material";
import {Fragment, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {authUseCase} from "../usecase/AuthUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {ToggleThemeButton} from "../../../utils/components/theme/ToggleThemeMode.tsx";
import forgetPasswordImage from "../../../utils/assets/images/forget_password_2.png";
import {ToggleLanguageButton} from "../../../i18n/components/ToggleLanguageButton.tsx";
import {useTranslation} from "react-i18next";

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
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <img alt={"forget password"} src={forgetPasswordImage} width={"55%"}/>
                            </div>
                        </Box>
                    </Fragment>
                )
            }
        </Box>
    )
}

const ForgottenForm = () => {
    const {t} = useTranslation()
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
                <Typography component="h1" level="h3">{t('forgotten_password_page.request_sent')}</Typography>
                <Typography component="h6" color="neutral">{t('forgotten_password_page.check_email')}</Typography>
                <Link level={"title-md"} href={"/app/login"} sx={{mt: 5}}>{t('forgotten_password_page.back')}</Link>
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
            <Typography component="h1" level="h3">{t('forgotten_password_page.title')}</Typography>
            <Typography component="h6" color="neutral">
                {t('forgotten_password_page.description')}
            </Typography>
            <FormControl>
                <FormLabel>{t('forgotten_password_page.inform_email')}</FormLabel>
                <TextInput
                    {...register("email", {required: "The email is required"})}
                    size={"md"}
                    variant={"soft"}
                />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.email?.message as string}
                </FormHelperText>
            </FormControl>
            <Button startDecorator={<LoginRounded/>} type={"submit"}>{t('forgotten_password_page.submit_button')}</Button>
            <Box display={"flex"} justifyContent={"center"}>
                <Link level={"title-md"} href={"/app/login"}>{t('forgotten_password_page.back')}</Link>
            </Box>
        </Box>
    )
}