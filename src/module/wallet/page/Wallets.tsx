import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useTranslation} from "react-i18next";
import {WalletsList} from "../components/WalletsList.tsx";
import {useSetAtom} from "jotai/index";
import WalletState from "../state/WalletState.ts";
import {WalletFormType} from "../entities/entities.ts";
import {WalletForm} from "../components/WalletForm.tsx";

export const Wallets = () => {
    const {t} = useTranslation();

    const modifiedWalletForm = useSetAtom(WalletState.FormTypeAtom)

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
                <Button
                    size="sm"
                    onClick={() => modifiedWalletForm(WalletFormType.REGISTER_WALLET)}
                >
                    {t('wallets.page.buttons.register')}
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <WalletsList/>
                <WalletForm/>
            </Box>
        </Box>
    )
}