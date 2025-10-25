import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {BoardList} from "../components/BoardList.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";

export const BoardPage = () => {
    const {t} = useTranslation();
    const setFormType = useSetAtom(CrmState.FormType)

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()

    const roles = getRolesByModule(CrmModules.Kanban)
    const module = getModuleByCode(CrmModules.Kanban)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_KANBAN || x.code === CrmDefaultRoles.ALL_KANBAN
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
                    {t("kanbans.title.boards")}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => setFormType(CrmFormType.REGISTER_BOARD)}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t("kanbans.page.buttons.register")}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <BoardList/>
        </Box>
    )
}