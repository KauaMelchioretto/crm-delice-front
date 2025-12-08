import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";
import {CampaignList} from "../components/CampaignList.tsx";

export const Campaign = () => {
    const {t} = useTranslation()

    const setFormType = useSetAtom(CrmState.FormType);

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()

    const roles = getRolesByModule(CrmModules.Campaign)
    const module = getModuleByCode(CrmModules.Campaign)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_CAMPAIGN || x.code === CrmDefaultRoles.ALL_CAMPAIGN
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
                    {t("campaign.page.title")}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => setFormType(CrmFormType.REGISTER_CAMPAIGN)}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t('campaign.page.buttons.register')}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <CampaignList/>
        </Box>
    )
}