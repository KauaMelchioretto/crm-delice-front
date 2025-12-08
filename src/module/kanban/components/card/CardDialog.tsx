import {useAtom, useAtomValue} from "jotai/index";
import CrmState from "../../../../utils/state/CrmState.ts";
import {CrmFormType, CrmModules} from "../../../../utils/entities/entities.ts";
import {CrmModal} from "../../../../utils/components/core/CrmModal.tsx";
import {Fragment, useEffect, useState} from "react";
import {kanbanUseCase} from "../../usecase/kanbanUseCase.ts";
import {Card, Tag} from "../../entities/entities.ts";
import {useSetAtom} from "jotai";
import {CrmContainer} from "../../../../utils/components/core/CrmContainer.tsx";
import {Box, Chip, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {Customer} from "../../../customer/entities/entities.ts";
import {Wallet} from "../../../wallet/entities/entities.ts";
import {useTheme} from "@mui/material";
import {useApp} from "../../../../core/config/app/AppProvider.tsx";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import {maskZipCode} from "../../../../utils/functions/MaskZipCode.ts";
import { useTranslation } from "react-i18next";

export const CardDialog = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const cardUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.READ_CARD:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CardDialogInfo cardUUID={cardUUID}/>
                </CrmModal>
            )
    }
}
const CardDialogInfo = ({cardUUID}: { cardUUID: string }) => {
    const setFormType = useSetAtom(CrmState.FormType);
    const { t } = useTranslation();
    const [card, setCard] = useState<Card | null>(null)

    useEffect(() => {
        kanbanUseCase.getCardByUUID(cardUUID).then((response) => {
            if (response.card) {
                setCard(response.card)
            }
        })
    }, [cardUUID]);

    if (!card) {
        return <></>
    }

    return (
        <CrmContainer sx={{minWidth: "500px"}}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {card.code} - {card.title}
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(CrmFormType.EMPTY)}
                    >
                        <CloseRounded/>
                    </IconButton>
                </Box>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                >
                    <DescriptionRoundedIcon/>
                    <Typography level={"body-sm"} fontWeight={"bold"}>
                        {t('kanbans.fields.description')}
                    </Typography>
                </Box>
                <Typography level={"body-sm"}>
                    {card.description}
                </Typography>
                {card.metadata?.customer && (
                    <CardCustomerInfo {...card.metadata?.customer} />
                )}
                {card.metadata?.wallet && (
                    <CardWalletInfo {...card.metadata?.wallet} />
                )}
                {card.tag && (
                    <CardTagInfo {...card.tag} />
                )}
            </Box>
        </CrmContainer>
    )
}

const CardCustomerInfo = (prop: Customer) => {
    const {crmModules} = useApp()
    const { t } = useTranslation();

    const CustomerIcon = crmModules.find(
        m => m.code == CrmModules.Customer
    )?.icon

    const address = () => {
        return `${
            maskZipCode(prop?.zipCode ?? "")
        } ${
            prop?.address ?? ""
        }, Nº ${
            prop?.addressNumber ?? ""
        } - ${
            prop?.city ?? ""
        } ${prop?.state ?? ""}`
    }

    return (
        <Fragment>
            <Box
                display={"flex"}
                alignItems={"center"}
                gap={1}
                sx={{mt: 1}}
            >
                {CustomerIcon && <CustomerIcon/>}
                <Typography level={"body-sm"} fontWeight={"bold"}>
                    {t('customers.page.entity')}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography level={"body-sm"}>
                    {t('customers.fields.trading_name')}
                </Typography>
                <Typography level={"body-sm"}>
                    {prop.tradingName}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography level={"body-sm"}>
                    {t('customers.fields.name_owner')}
                </Typography>
                <Typography level={"body-sm"}>
                    {prop.personName}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography level={"body-sm"}>
                    {t('customers.fields.address')}
                </Typography>
                <Typography level={"body-sm"}>
                    {address()}
                </Typography>
            </Box>
        </Fragment>
    )
}

const CardWalletInfo = (prop: Wallet) => {
    const {crmModules} = useApp()
    const { t } = useTranslation();

    const WalletIcon = crmModules.find(
        m => m.code == CrmModules.Wallet
    )?.icon

    return (
        <Fragment>
            <Box
                display={"flex"}
                alignItems={"center"}
                gap={1}
                sx={{mt: 1}}
            >
                {WalletIcon && <WalletIcon/>}
                <Typography level={"body-sm"} fontWeight={"bold"}>
                    {t('wallets.fields.wallet')}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography level={"body-sm"}>
                    {t('wallets.fields.title')}
                </Typography>
                <Typography level={"body-sm"}>
                    {prop.label}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography level={"body-sm"}>
                    {t('wallets.fields.accountable')}
                </Typography>
                <Typography level={"body-sm"}>
                    {prop.accountable?.login}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography level={"body-sm"}>
                    {t('wallets.fields.observations')}
                </Typography>
                <Typography level={"body-sm"}>
                    {prop.observation}
                </Typography>
            </Box>
        </Fragment>
    )
}

const CardTagInfo = (prop: Tag) => {
    const theme = useTheme()

    return (
        <Fragment>
            <Box
                display={"flex"}
                alignItems={"center"}
                gap={1}
                sx={{mt: 1}}
            >
                <LayersRoundedIcon/>
                <Typography level={"body-sm"} fontWeight={"bold"}>
                    Tag
                </Typography>
            </Box>
            <Chip
                variant={"solid"}
                sx={{
                    pt: 0.5,
                    pb: 0.5,
                    borderRadius: theme.spacing(1),
                    backgroundColor: prop.color
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5
                    }}
                >
                    {prop.title} - {prop.description}
                </div>
            </Chip>
        </Fragment>
    )
}