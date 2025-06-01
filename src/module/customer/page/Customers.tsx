import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer";
import {useTranslation} from "react-i18next";
import {useSetAtom} from "jotai";
import CustomersState from "../state/CustomersState.ts";
import {CustomerFormType} from "../entities/entities.ts";
import {CustomersList} from "../components/CustomersList";
import {CustomerForm} from "../components/CustomerForm.tsx";

export const Customers = () => {
    const {t} = useTranslation();
    const modifiedCustomerForm = useSetAtom(CustomersState.CustomerFormTypeAtom);

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
                    onClick={() => modifiedCustomerForm(CustomerFormType.REGISTER_CUSTOMER)}
                >
                    {t('customers.page.buttons.register')}
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <CustomersList/>
                <CustomerForm/>
            </Box>
        </Box>
    );
};
