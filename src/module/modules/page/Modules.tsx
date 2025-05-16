import {Box, Button, Typography} from "@mui/joy";
import {ModulesList} from "../components/ModulesList.tsx";
import {ModulesForm} from "../components/ModulesForm.tsx";
import {useSetAtom} from "jotai";
import ModulesState from "../state/ModulesState.ts";
import {ModulesFormType} from "../enitites/entities.ts";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";

export const Modules = () => {
    const modifiedModuleForm = useSetAtom(ModulesState.ModulesFormTypeAtom);

    return (
        <Box
            sx={{
                heigth: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography level={"body-lg"} fontWeight={"bold"}>Modules</Typography>
                <Button size={"sm"} onClick={() => modifiedModuleForm(ModulesFormType.REGISTER_MODULE)}>
                    Register module
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <ModulesList/>
                <ModulesForm/>
            </Box>
        </Box>
    )
}