import {useAtom, useAtomValue} from "jotai";
import UserState from "../state/UserState.ts";
import {useEffect, useState} from "react";
import {useSetAtom} from "jotai/index";
import {
    Box,
    Button, Checkbox, CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    TabList,
    Tabs,
    Tab,
    Typography,
    TabPanel
} from "@mui/joy";
import {UsersFormType} from "../entities/entities.ts";
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
import {Role} from "../../modules/enitites/entities.ts";
import {maskCPF} from "../../../utils/functions/DocumentValidation.ts";
import {maskPhone} from "../../../utils/functions/MaskPhone.ts";
import {maskZipCode} from "../../../utils/functions/MaskZipCode.ts";
import {useTranslation} from "react-i18next";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";

export const UserForm = () => {
    const [formType, setFormType] = useAtom(UserState.UserFormTypeAtom)
    const userUUID = useAtomValue(UserState.UserFormUUIDAtom)

    switch (formType) {
        case UsersFormType.EMPTY:
            return <></>
        case UsersFormType.REGISTER_USER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(UsersFormType.EMPTY)}
                >
                    <UserRegister/>
                </CrmModal>
            );
        case UsersFormType.EDIT_USER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(UsersFormType.EMPTY)}
                >
                    <UserRegister userUUID={userUUID}/>
                </CrmModal>
            );
        case UsersFormType.ATTACH_ROLE:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(UsersFormType.EMPTY)}
                >
                    <UserAttachRole userUUID={userUUID}/>
                </CrmModal>
            );
    }
}

const UserRegister = ({userUUID}: { userUUID?: string }) => {
    const {t} = useTranslation();

    const setFormType = useSetAtom(UserState.UserFormTypeAtom);

    const updateList = useSetAtom(UserState.UserUpdateAtom)

    const formMethods = useForm();

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
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "The module is included with success", 2000);
                    updateList(prev => !prev);
                    setFormType(UsersFormType.EMPTY);
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
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);
                updateList(prev => !prev);
                setFormType(UsersFormType.EMPTY);
            }
        })
    });

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
        <CrmContainer sx={{padding: 0}}>
            <FormProvider {...formMethods}>
                <Tabs>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    sx={{pb: 0.5, pt: 0.5, pr: 0.5, pl: "var(--Tabs-spacing)"}}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {userUUID ? "Edit" : "Register"} User
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(UsersFormType.EMPTY)}
                    >
                        <CloseRounded/>
                    </IconButton>
                </Box>
                    <TabList>
                        <Tab sx={{textAlign: "start"}}>{t("users.page.tabs.user_data")}</Tab>
                        <Tab>Avatar</Tab>
                        <Tab>{t("actions.roles")}</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                            component={"form"}
                            onSubmit={handleFormUsers}
                        >
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <Box display={"flex"} alignItems={"center"} gap={1}>
                                    <FormControl>
                                        <FormLabel>{t("users.fields.login")}</FormLabel>
                                        <TextInput
                                            {...register("login", {required: "The login is required"})}
                                            size={"md"}
                                            variant={"soft"}
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
                                                    {...register("password", {required: "The password is required"})}
                                                    size={"md"}
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
                                                    value: "EMPLOYEE",
                                                    label: t("role_types.employee"),
                                                },
                                                {
                                                    value: "OWNER",
                                                    label: t("role_types.owner"),
                                                },
                                                {
                                                    value: "DEV",
                                                    label: t("role_types.developer"),
                                                },
                                            ]}
                                        />
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"} gap={1}>
                                    <FormControl>
                                        <FormLabel>{t("users.fields.name")}</FormLabel>
                                        <TextInput
                                            {...register("name", {required: "The name is required"})}
                                            size={"md"}
                                            variant={"soft"}
                                        />
                                        <FormHelperText sx={{minHeight: "1rem"}}>
                                            {errors?.name?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>{t('users.fields.surname')}</FormLabel>
                                        <TextInput
                                            {...register("surname", {required: "The surname is required"})}
                                            size={"md"}
                                            variant={"soft"}
                                        />
                                        <FormHelperText sx={{minHeight: "1rem"}}>
                                            {errors?.surname?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>{t("users.fields.document")}</FormLabel>
                                        <CpfInput
                                            {...register("document", {required: "The document is required"})}
                                            size={"md"}
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
                                        {...register("email", {required: "The email is required"})}
                                        size={"md"}
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
                                                size={"md"}
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
                                                {...register("dateOfBirth", {required: "The date of birth is required"})}
                                                size={"md"}
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
                                            {...register("zipCode", {required: "The zip code is required"})}
                                            size={"md"}
                                            variant={"soft"}
                                        />
                                        <FormHelperText sx={{minHeight: "1rem"}}>
                                            {errors?.zipCode?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>{t("users.fields.city")}</FormLabel>
                                        <TextInput
                                            {...register("city", {required: "The city is required"})}
                                            size={"md"}
                                            variant={"soft"}
                                        />
                                        <FormHelperText sx={{minHeight: "1rem"}}>
                                            {errors?.city?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>{t("users.fields.state")}</FormLabel>
                                        <TextInput
                                            {...register("state", {required: "The state is required"})}
                                            size={"md"}
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
                                            {...register("address", {required: "The address is required"})}
                                            size={"md"}
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
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={1}>
                        OPA
                    </TabPanel>
                    <TabPanel value={2}>
                        OPA
                    </TabPanel>
                    <Box sx={{p: "var(--Tabs-spacing)", pt: 0}} display={"flex"}>
                        <Button type={"submit"} sx={{flex: 1}}>{userUUID ? t("actions.save") : t("actions.register")}</Button>
                    </Box>
                </Tabs>
            </FormProvider>
        </CrmContainer>
    );
}

const UserAttachRole = ({userUUID}: { userUUID: string }) => {
    const setFormType = useSetAtom(UserState.UserFormTypeAtom);
    const [roles, setRoles] = useState<{ id: number, uuid: string, added: boolean, code: string, label: string }[]>([]);
    const rolesAtom = useAtomValue(ModulesState.AllRolesAtom);
    const { t } = useTranslation(); 

    const formMethods = useForm();

    const {handleSubmit} = formMethods;

    const handleSubmitRoles = handleSubmit(() => {
        usersUseCase.attachRolePerUser(
            userUUID,
            roles?.filter(c => c.added)?.map(c => c.uuid)
        ).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);
                setFormType(UsersFormType.EMPTY);
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

                const list = rolesAtom.data?.roles?.map((x: Role, i: number) => ({
                    id: i,
                    uuid: x?.uuid ?? "",
                    code: x?.code ?? "",
                    label: x?.label ?? "",
                    added: addedRoles.includes(x?.uuid ?? '')
                })) ?? []

                setRoles(list)
            })
        }
    }, [rolesAtom, userUUID]);

    if (rolesAtom.state === "loading") {
        return (
            <CircularProgress/>
        )
    }

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
                            Attach roles
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(UsersFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        {
                            roles.sort((a, b) => a.id - b.id).map((x, i) => (
                                <FormControl
                                    key={`check_role_${i}`}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 1,
                                        alignItems: "center"
                                    }}
                                >
                                    <Checkbox
                                        size={"sm"}
                                        checked={x.added}
                                        onChange={() => {
                                            const added = roles.find(
                                                c => c.code === x.code
                                            )?.added ?? false;

                                            const list = roles.filter(
                                                c => c.uuid !== x.uuid
                                            );

                                            if (added) {
                                                list.push({
                                                    id: x?.id ?? 0,
                                                    uuid: x?.uuid ?? "",
                                                    code: x?.code ?? "",
                                                    label: x?.label ?? "",
                                                    added: false
                                                })
                                            } else {
                                                list.push({
                                                    id: x?.id ?? 0,
                                                    uuid: x?.uuid ?? "",
                                                    code: x?.code ?? "",
                                                    label: x?.label ?? "",
                                                    added: true
                                                })
                                            }
                                            setRoles(list)
                                        }}
                                    />
                                    <FormLabel>{x.label}</FormLabel>
                                </FormControl>
                            ))
                        }
                    </Box>
                    <Button type={"submit"}>{t("actions.save")}</Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}