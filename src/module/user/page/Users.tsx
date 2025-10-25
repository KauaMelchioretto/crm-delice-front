import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import {UsersList} from "../components/UsersList";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";

export const User = () => {
    const {t} = useTranslation()

    const setFormType = useSetAtom(CrmState.FormType);

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()

    const roles = getRolesByModule(CrmModules.User)
    const module = getModuleByCode(CrmModules.User)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_USER || x.code === CrmDefaultRoles.ALL_USER
    ).length > 0

    const ModuleIcon = module.icon!

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
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    {t('users.page.title')}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => setFormType(CrmFormType.REGISTER_USER)}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t('users.page.buttons.register')}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <UsersList/>
        </Box>
    );
}