import {useAtom, useAtomValue} from "jotai";
import UserState from "../state/UserState.ts";
import {Fragment, useEffect, useRef, useState} from "react";
import {useSetAtom} from "jotai/index";
import {
    Box,
    Button, Checkbox, CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Typography,
} from "@mui/joy";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";
import {CpfInput} from "../../../utils/components/inputs/CpfInput.tsx";
import {PhoneInput} from "../../../utils/components/inputs/PhoneInput.tsx";
import {DateInput} from "../../../utils/components/inputs/DateInput.tsx";
import {ZipCodeInput} from "../../../utils/components/inputs/ZipCodeInput.tsx";
import {usersUseCase} from "../usecase/UsersUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import ModulesState from "../../modules/state/ModulesState.ts";
import {maskCPF} from "../../../utils/functions/DocumentValidation.ts";
import {maskPhone} from "../../../utils/functions/MaskPhone.ts";
import {maskZipCode} from "../../../utils/functions/MaskZipCode.ts";
import {useTranslation} from "react-i18next";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import SearchRounded from '@mui/icons-material/SearchRounded';
import {handleGetAddress} from "../../../utils/functions/Address.ts";
import { UserType } from "../entities/entities.ts";

export const UserForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType)
    const userUUID = useAtomValue(CrmState.EntityFormUUID)

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>
        case CrmFormType.REGISTER_USER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <UserRegister/>
                </CrmModal>
            );
        case CrmFormType.EDIT_USER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <UserRegister userUUID={userUUID}/>
                </CrmModal>
            );
        case CrmFormType.ATTACH_ROLE:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <UserAttachRole userUUID={userUUID}/>
                </CrmModal>
            );
    }
}

const UserRegister = ({userUUID}: { userUUID?: string }) => {
    const {t} = useTranslation();

    const setFormType = useSetAtom(CrmState.FormType);

    const updateList = useSetAtom(UserState.UpdateAtom)

    const formMethods = useForm();

    const inputZipCode = useRef(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {register, handleSubmit, setValue, formState: {errors}} = formMethods

    const handleFormUsers = handleSubmit((data: FieldValues) => {
        if (userUUID) {
            usersUseCase.saveUser({
                uuid: userUUID,
                login: data.login,
                password: data.password,
                name: data.name,
                surname: data.surname,
                email: data.email,
                userType: data.userType,
                document: data.document,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth,
                state: data.state,
                city: data.city,
                zipCode: data.zipCode,
                address: data.address,
                status: data.status
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", t(`users.errors.${response.error}`), 2000);
                } else {
                    popup.toast("success", t('users.messages.save_success'), 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
            return;
        }
        usersUseCase.createUser({
            login: data.login,
            password: data.password,
            name: data.name,
            surname: data.surname,
            email: data.email,
            userType: data.userType,
            document: data.document,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            state: data.state,
            city: data.city,
            zipCode: data.zipCode,
            address: data.address
        }).then((response) => {
            if (response.error) {
                popup.toast("error", t(`users.errors.${response.error}`), 2000);
            } else {
                popup.toast("success", t('users.messages.save_success'), 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    });

    const handleGetUserAddress = (query: string) => {
        setLoading(true)
        handleGetAddress(query).then((response) => {
            if (response.address) {
                setValue("zipCode", maskZipCode(response.address.zipCode))
                setValue("city", response.address.city)
                setValue("state", response.address.state)
                setValue("address", `${response.address.address} - ${response.address.district}`)
            }
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (userUUID) {
            usersUseCase.getUserByUUID(userUUID).then((response) => {
                if (response.user) {
                    setValue("login", response.user.login)
                    setValue("password", response.user.password)
                    setValue("name", response.user.name)
                    setValue("surname", response.user.surname)
                    setValue("document", maskCPF(response.user.document))
                    setValue("email", response.user.email)
                    setValue("phone", response.user.phone ? maskPhone(response.user.phone) : "")
                    setValue("dateOfBirth", response.user.dateOfBirth)
                    setValue("zipCode", response.user.zipCode ? maskZipCode(response.user.zipCode) : "")
                    setValue("city", response.user.city)
                    setValue("state", response.user.state)
                    setValue("address", response.user.address)
                    setValue("status", response.user.status)
                    setValue("userType", response.user.userType)
                }
            })
        }
    }, [setValue, userUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {userUUID ? t('actions.edit') : t('actions.register')} {t("users.fields.user")}
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(CrmFormType.EMPTY)}
                    >
                        <CloseRounded/>
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        pt: 2
                    }}
                    component={"form"}
                    onSubmit={handleFormUsers}
                >
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <FormControl>
                            <FormLabel>{t("users.fields.login")}</FormLabel>
                            <TextInput
                                {...register("login", {required: t('users.messages.login_required')})}
                                size={"sm"}
                                variant={"soft"}
                                disabled={!!userUUID}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.login?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {
                            !userUUID && (
                                <FormControl>
                                    <FormLabel>{t("users.fields.password")}</FormLabel>
                                    <TextInput
                                        {...register("password", {required: t('users.messages.password_required')})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.password?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            )
                        }
                        <Box sx={{width: "100%"}}>
                            <CrmSelect
                                name={"userType"}
                                label={t("users.fields.user_type")}
                                options={[
                                    {
                                        value: UserType.EMPLOYEE,
                                        label: t("role_types.employee"),
                                    },
                                    {
                                        value: UserType.OWNER,
                                        label: t("role_types.owner"),
                                    },
                                    {
                                        value: UserType.DEV,
                                        label: t("role_types.developer"),
                                    },
                                ]}
                                // @ts-ignore
                                rules={{rules: {required: t('users.messages.user_type_required')}}}
                            />
                        </Box>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <FormControl>
                            <FormLabel>{t("users.fields.name")}</FormLabel>
                            <TextInput
                                {...register("name", {required: t('users.messages.name_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.name?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t('users.fields.surname')}</FormLabel>
                            <TextInput
                                {...register("surname", {required: t('users.messages.surname_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.surname?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t("users.fields.document")}</FormLabel>
                            <CpfInput
                                {...register("document", {required: t('users.messages.document_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.document?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <FormControl>
                        <FormLabel>{t("users.fields.email")}</FormLabel>
                        <TextInput
                            {...register("email", {required: t('users.messages.email_required')})}
                            size={"sm"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.email?.message as string}
                        </FormHelperText>
                    </FormControl>

                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Box sx={{width: "100%"}}>
                            <FormControl>
                                <FormLabel>{t("users.fields.phone")}</FormLabel>
                                <PhoneInput
                                    {...register("phone")}
                                    size={"sm"}
                                    variant={"soft"}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.phone?.message as string}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                        <Box sx={{width: "100%"}}>
                            <FormControl>
                                <FormLabel>{t("users.fields.date_of_birth")}</FormLabel>
                                <DateInput
                                    {...register("dateOfBirth", {required: t('users.messages.date_of_birth_required')})}
                                    size={"sm"}
                                    variant={"soft"}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.dateOfBirth?.message as string}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <FormControl>
                            <FormLabel>CEP</FormLabel>
                            <ZipCodeInput
                                {...register("zipCode", {required: t('users.messages.zip_code_required')})}
                                size={"sm"}
                                variant={"soft"}
                                inputRef={inputZipCode}
                                endDecorator={
                                    loading ? (
                                        <CircularProgress size={"sm"}/>
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                if (inputZipCode.current === null) return

                                                const query = (inputZipCode.current as HTMLInputElement).value ?? ""

                                                if (!query) return

                                                handleGetUserAddress(query)
                                            }}
                                        >
                                            <SearchRounded/>
                                        </IconButton>
                                    )
                                }
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.zipCode?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t("users.fields.city")}</FormLabel>
                            <TextInput
                                {...register("city", {required: t('users.messages.city_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.city?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t("users.fields.state")}</FormLabel>
                            <TextInput
                                {...register("state", {required: t('users.messages.state_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.state?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>{t("users.fields.address")}</FormLabel>
                            <TextInput
                                {...register("address", {required: t('users.messages.address_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.address?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <Box sx={{flex: 0.5}}>
                            <CrmSelect
                                name={"status"}
                                label={t("users.fields.status.label")}
                                options={[
                                    {
                                        value: "ACTIVE",
                                        label: t("users.fields.status.active"),
                                    },
                                    {
                                        value: "INACTIVE",
                                        label: t("users.fields.status.inactive"),
                                    },
                                    {
                                        value: "FIRST_ACCESS",
                                        label: t("users.fields.status.first_access"),
                                    }
                                ]}
                                // @ts-ignore
                                rules={{rules: {required: t('users.messages.status_required')}}}
                            />
                        </Box>
                    </Box>
                    <Box sx={{p: "var(--Tabs-spacing)", pt: 0}} display={"flex"}>
                        <Button
                            type={"submit"}
                            sx={{flex: 1}}
                        >
                            {userUUID ? t("actions.save") : t("actions.register")}
                        </Button>
                    </Box>
                </Box>
            </FormProvider>
        </CrmContainer>
    );
}

const UserAttachRole = ({userUUID}: { userUUID: string }) => {
    const setFormType = useSetAtom(CrmState.FormType);
    const [roles, setRoles] = useState<string[]>([]);
    const rolesAtom = useAtomValue(ModulesState.AllRolesAtom);
    const {t} = useTranslation();

    const formMethods = useForm();

    const {handleSubmit} = formMethods;

    const handleSubmitRoles = handleSubmit(() => {
        usersUseCase.attachRolePerUser(
            userUUID,
            roles
        ).then((response) => {
            if (response.error) {
                popup.toast("error", t(`users.errors.${response.error}`), 2000);
            } else {
                popup.toast("success", t('users.messages.attach_role_success'), 2000);
                setFormType(CrmFormType.EMPTY);
            }
        })
    });

    useEffect(() => {
        if (rolesAtom.state === "hasData") {
            usersUseCase.getUserRolesByUUID(userUUID).then((response) => {
                let addedRoles: string[] = []

                if (response.roles) {
                    addedRoles = response?.roles?.map(x => x?.uuid ?? "") ?? []
                }

                setRoles(addedRoles)
            })
        }
    }, [rolesAtom, userUUID]);

    if (rolesAtom.state === "loading") {
        return (
            <CircularProgress/>
        )
    }

    const modules = rolesAtom.state === "hasData" ? rolesAtom?.data?.modules ?? [] : []

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                    component={"form"}
                    onSubmit={handleSubmitRoles}
                >
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            {t('users.page.buttons.attach_roles')}
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(CrmFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            maxHeight: "500px",
                            overflowY: "auto"
                        }}
                    >
                        {modules.map((m, im) => (
                            <Fragment key={`module_${im}`}>
                                <Box
                                    sx={{
                                        display: "flex"
                                    }}
                                >
                                    <Typography
                                        level={"body-md"}
                                        fontWeight={"bold"}
                                    >
                                        {m.label}
                                    </Typography>
                                </Box>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                                    {
                                        m.roles?.map((r, ir) => (
                                            <Box
                                                key={`modules_${im}_${ir}`}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 1,
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Checkbox
                                                    size={"sm"}
                                                    checked={roles.includes(r?.uuid ?? "")}
                                                    onChange={(evt) => {
                                                        const roleUUID = r?.uuid ?? ""

                                                        if (evt.target.checked) {
                                                            setRoles(prev =>
                                                                [...prev, roleUUID]
                                                            )
                                                        } else {
                                                            setRoles(prev =>
                                                                prev.filter(x => x !== roleUUID)
                                                            )
                                                        }
                                                    }}
                                                />
                                                <Typography>{r.label}</Typography>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Fragment>
                        ))}
                    </Box>
                    <Button type={"submit"}>{t("actions.save")}</Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}