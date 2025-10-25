import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import {WalletsList} from "../components/WalletsList.tsx";
import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";

export const Wallets = () => {
    const {t} = useTranslation();

    const setFormType = useSetAtom(CrmState.FormType)

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()

    const roles = getRolesByModule(CrmModules.Wallet)
    const module = getModuleByCode(CrmModules.Wallet)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_WALLET || x.code === CrmDefaultRoles.ALL_WALLET
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
                    {t("wallets.page.title")}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => setFormType(CrmFormType.REGISTER_WALLET)}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t('wallets.page.buttons.register')}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <WalletsList/>
        </Box>
    )
}