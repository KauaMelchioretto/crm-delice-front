import {Outlet, useNavigate} from "react-router-dom";
import Layout from "../../../../utils/layout/Layout.tsx";
import {MenuSide} from "../../../../utils/components/menuside/MenuSide.tsx";
import {StoreRounded} from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    Typography
} from "@mui/joy";
import {Fragment, useContext} from "react";
import {ToggleThemeButton} from "../../../../utils/components/theme/ToggleThemeMode.tsx";
import {ToggleLanguageButton} from "../../../../i18n/components/ToggleLanguageButton.tsx";
import {useAuth} from "../../../auth/provider/AuthProvider.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {CrmContainer} from "../../../../utils/components/core/CrmContainer.tsx";
import {PasswordInput} from "../../../../utils/components/inputs/PasswordInput.tsx";
import {authUseCase} from "../../../auth/usecase/AuthUseCase.ts";
import {popup} from "../../../../utils/alerts/Popup.ts";
import {CrmModal} from "../../../../utils/components/core/CrmModal.tsx";
import {CrmAppBar} from "../../../../utils/components/appbar/component/AppBar.tsx";
import {useApp} from "../../app/AppProvider.tsx";
import {useTranslation} from "react-i18next";
import {InitAtoms} from "../../app/InitAtoms.tsx";

export const DefaultPage = () => (
    <Layout.Root>
        <ValidateFirstAccess/>
        <Content/>
    </Layout.Root>
);

const Content = () => {
    const {show} = useContext(Layout.RootContext);

    const {user} = useAuth()
    const {crmModules} = useApp();

    const forms = crmModules.map(x => x.form)

    if(user?.status === "FIRST_ACCESS"){
        return
    }

    return (
        <Fragment>
            <InitAtoms/>
            {
                show && (
                    <Fragment>
                        <Layout.Header>
                            <CrmAppBar/>
                        </Layout.Header>
                        <Layout.SideNav>
                            <MenuSide/>
                        </Layout.SideNav>
                    </Fragment>
                )
            }
            <Layout.Main>
                <Outlet/>
            </Layout.Main>
            {forms}
        </Fragment>
    )
}

const ValidateFirstAccess = () => {
    const {user} = useAuth()

    const {t} = useTranslation()

    const formMethods = useForm();

    const {register, handleSubmit, formState: {errors}} = formMethods

    const navigate = useNavigate()

    const handleFormNewPassword = handleSubmit((data: FieldValues) => {
        authUseCase.changePassword({
            newPassword: data.password,
            confirmPassword: data.confirmPassword
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "Change password with success", 2000);
                navigate("/home")
            }
        })
    })

    return (
        <CrmModal
            open={user?.status === "FIRST_ACCESS"}
        >
            <CrmContainer>
                <FormProvider {...formMethods}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                        component={"form"}
                        onSubmit={handleFormNewPassword}
                    >
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
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
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{mt: 1}}>
                            <Typography color={"neutral"} level={"body-lg"} fontWeight={"bold"}>
                                {t('first_access.title')}
                            </Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{mt: 5}}>
                            <Typography color={"danger"} level={"body-md"} fontWeight={"bold"}>
                                {t('first_access.text')}
                            </Typography>
                        </Box>

                        <FormControl>
                            <FormLabel>{t('first_access.password')}</FormLabel>
                            <PasswordInput
                                {...register("password", {required: "The password is required"})}
                                size={"md"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.password?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t('first_access.confirm_password')}</FormLabel>
                            <PasswordInput
                                {...register("confirmPassword", {required: "The confirm password is required"})}
                                size={"md"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.confirmPassword?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <Button type={"submit"}>{t('first_access.confirm')}</Button>
                    </Box>
                </FormProvider>
            </CrmContainer>
        </CrmModal>
    )
}