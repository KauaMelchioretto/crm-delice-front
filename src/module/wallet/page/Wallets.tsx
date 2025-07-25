import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import {WalletsList} from "../components/WalletsList.tsx";
import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";

export const Wallets = () => {
    const {t} = useTranslation();

    const modifiedWalletForm = useSetAtom(CrmState.FormType)

    const {getRolesByModule} = useAuth()

    const roles = getRolesByModule(CrmModules.Wallet)

    const canCreate = roles.filter(x => x.code === "CREATE_WALLET" || x.code === "ALL_WALLET").length > 0

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
                            onClick={() => modifiedWalletForm(CrmFormType.REGISTER_WALLET)}
                        >
                            {t('wallets.page.buttons.register')}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <WalletsList/>
            </Box>
        </Box>
    )
}