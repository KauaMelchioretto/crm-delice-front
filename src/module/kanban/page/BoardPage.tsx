import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {BoardList} from "../components/BoardList.tsx";

export const BoardPage = () => {
    const modifiedKanbanFormType = useSetAtom(CrmState.FormType)
    const {t} = useTranslation();

    const {getRolesByModule} = useAuth()

    const roles = getRolesByModule(CrmModules.Kanban)

    const canCreate = roles.filter(
        x => x.code === "CREATE_KANBAN" || x.code === "ALL_KANBAN"
    ).length > 0

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
                            onClick={() => modifiedKanbanFormType(CrmFormType.REGISTER_BOARD)}
                        >
                            {t("kanbans.page.buttons.register")}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <BoardList/>
            </Box>
        </Box>
    )
}