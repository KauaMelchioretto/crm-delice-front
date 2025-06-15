import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer";
import {useTranslation} from "react-i18next";
import {useSetAtom} from "jotai";
import {CustomersList} from "../components/CustomersList";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";

export const Customers = () => {
    const {t} = useTranslation();
    const modifiedCustomerForm = useSetAtom(CrmState.FormType);

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
                    {t("customers.page.title")}
                </Typography>
                <Button
                    size="sm"
                    onClick={() => modifiedCustomerForm(CrmFormType.REGISTER_CUSTOMER)}
                >
                    {t('customers.page.buttons.register')}
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <CustomersList/>
            </Box>
        </Box>
    );
};
