import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import {UsersList} from "../components/UsersList";
import UserState from "../state/UserState.ts";
import {UserForm} from "../components/UserForm.tsx";
import {UsersFormType} from "../entities/entities.ts";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";

export const User = () => {
    const {t} = useTranslation()

    const modifiedUserForm = useSetAtom(UserState.UserFormTypeAtom);

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography level={"body-lg"} fontWeight={"bold"}>{t('user_page.title')}</Typography>
                <Button size="sm" onClick={() => modifiedUserForm(UsersFormType.REGISTER_USER)}>
                    {t('user_page.register_button')}
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <UsersList/>
                <UserForm/>
            </Box>
        </Box>
    );
}