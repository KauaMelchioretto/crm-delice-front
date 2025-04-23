import {useAtomValue} from "jotai";
import UserState from "../state/UserState.ts";
import {ReactElement} from "react";
import {useSetAtom} from "jotai/index";
import {Box, FormControl, FormHelperText, FormLabel, IconButton, Modal, ModalDialog, Typography} from "@mui/joy";
import {UsersFormType} from "../entities/entities.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";

export const UserForm = () => {
    const formType = useAtomValue(UserState.UserFormTypeAtom)
    const userUUID = useAtomValue(UserState.UserFormUUIDAtom)

    switch (formType) {
        case UsersFormType.EMPTY:
            return <></>
        case UsersFormType.REGISTER_USER:
            return (
                <UserFormModal>
                    <UserRegister/>
                </UserFormModal>
            );
        case UsersFormType.EDIT_USER:
            return (
                <UserFormModal>
                    <UserRegister userUUID={userUUID}/>
                </UserFormModal>
            );
    }
}

const UserFormModal = (
    {children}: { children: ReactElement }
) => {
    const setFormType = useSetAtom(UserState.UserFormTypeAtom);

    return (
        <Modal
            open={true}
            onClose={() => setFormType(UsersFormType.EMPTY)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ModalDialog variant={"outlined"} size={"lg"} sx={{p: 0, maxWidth: 600}}>
                {children}
            </ModalDialog>
        </Modal>
    )
}

const UserRegister = ({userUUID}: { userUUID?: string }) => {
    const setFormType = useSetAtom(UserState.UserFormTypeAtom);

    const formMethods = useForm();

    const {register, handleSubmit, setValue, formState: {errors}} = formMethods

    const handleFormUsers = handleSubmit((data: FieldValues) => {
        console.log(data)
    })

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
                    onSubmit={handleFormUsers}
                >
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
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
                    <Box display={"flex"} alignItems={"center"} gap={1}>
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
                            <TextInput
                                {...register("password", {required: "The password is required"})}
                                size={"md"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.password?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <CrmSelect
                            name={"userType"}
                            label={"User type"}
                            options={[
                                {
                                    value: "employee",
                                    label: "Employee",
                                },
                                {
                                    value: "owner",
                                    label: "Owner",
                                },
                                {
                                    value: "dev",
                                    label: "Developer",
                                },
                            ]}
                        />
                    </Box>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
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
                            <FormLabel>Surname</FormLabel>
                            <TextInput
                                {...register("surname", {required: "The surname is required"})}
                                size={"md"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.surname?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {/*<FormControl>*/}
                        {/*    <FormLabel>CPF</FormLabel>*/}
                        {/*    <*/}
                        {/*        {...register("document", {required: "The document is required"})}*/}
                        {/*        size={"md"}*/}
                        {/*        variant={"soft"}*/}
                        {/*    />*/}
                        {/*    <FormHelperText sx={{minHeight: "1rem"}}>*/}
                        {/*        {errors?.document?.message as string}*/}
                        {/*    </FormHelperText>*/}
                        {/*</FormControl>*/}
                    </Box>
                    <FormControl>
                        <FormLabel>E-mail</FormLabel>
                        <TextInput
                            {...register("email", {required: "The email is required"})}
                            size={"md"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.email?.message as string}
                        </FormHelperText>
                    </FormControl>
                </Box>
            </FormProvider>
        </CrmContainer>
    );
}
