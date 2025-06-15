import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import {UsersList} from "../components/UsersList";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";

export const User = () => {
    const {t} = useTranslation()

    const modifiedUserForm = useSetAtom(CrmState.FormType);

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
                <Typography level={"body-lg"} fontWeight={"bold"}>{t('users.page.title')}</Typography>
                <Button size="sm" onClick={() => modifiedUserForm(CrmFormType.REGISTER_USER)}>
                    {t('users.page.buttons.register')}
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"}>
                <UsersList/>
            </Box>
        </Box>
    );
}