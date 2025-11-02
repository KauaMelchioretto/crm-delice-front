import {Box, Button, Typography} from "@mui/joy";
import {CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useSetAtom} from "jotai";
import CrmState from "../../../utils/state/CrmState.ts";
import {TaskList} from "../components/TaskList.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";

export const Tasks = () => {
    const modifiedTaskFormType = useSetAtom(CrmState.FormType)

    const {getModuleByCode} = useApp()

    const module = getModuleByCode(CrmModules.Task)

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
                    Tarefas
                </Typography>
                <Button
                    size="sm"
                    onClick={() => modifiedTaskFormType(CrmFormType.REGISTER_TASK)}
                    startDecorator={<ModuleIcon/>}
                >
                    Cadastrar tarefa
                </Button>
            </CrmTitleContainer>
            <TaskList/>
        </Box>
    )
}