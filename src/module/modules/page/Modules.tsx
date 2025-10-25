import {Box, Button, Typography} from "@mui/joy";
import {ModulesList} from "../components/ModulesList.tsx";
import {useSetAtom} from "jotai";
import ModulesState from "../state/ModulesState.ts";
import {ModulesFormType} from "../enitites/entities.ts";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import {CrmModules} from "../../../utils/entities/entities.ts";
import {useApp} from "../../../core/config/app/AppProvider.tsx";

export const Modules = () => {
    const setFormType = useSetAtom(ModulesState.ModulesFormTypeAtom);
    const {t} = useTranslation();

    const {getModuleByCode} = useApp()

    const module = getModuleByCode(CrmModules.System)

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
                    alignItems: "center"
                }}
            >
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    Modules
                </Typography>
                <Button
                    size={"sm"}
                    onClick={() => {
                        setFormType(ModulesFormType.REGISTER_MODULE)
                    }}
                    startDecorator={<ModuleIcon/>}
                >
                    {t("modules.labels.register_module")}
                </Button>
            </CrmTitleContainer>
            <ModulesList/>
        </Box>
    )
}