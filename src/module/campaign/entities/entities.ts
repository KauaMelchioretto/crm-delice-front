import {User} from "../../user/entities/entities.ts";
import {CrmCardStatusProps, PaginatedResponse} from "../../../utils/entities/entities.ts";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";
import QueryBuilderRounded from "@mui/icons-material/QueryBuilderRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";

import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import {LoaderFunctionArgs} from "react-router-dom";
import {campaignUseCase} from "../usecase/CampaignUseCase.ts";

export interface Campaign {
    uuid?: string
    title: string
    description: string
    objective: string
    status?: CampaignStatus
    type?: CampaignType
    metadata?: CampaignMetadata
    start?: string
    end?: string
    createdBy?: User
    modifiedBy?: User
    createdAt?: string
    modifiedAt?: string
}

export enum CampaignType {
    SALE = 0,
    LEAD = 1
}

export enum CampaignStatus {
    ACTIVE = 0,
    INACTIVE = 1,
    FORM_PENDING = 2
}

export interface CampaignMetadata {
    products?: DiscountedProduct[]
    salesTarget?: number
    campaignLeadFields?: CampaignLeadFields
}

export interface DiscountedProduct {
    product: string,
    discount: number
}

export interface CampaignLeadFields {
    type: CampaignLeadFieldType,
    active: boolean
}

export enum CampaignLeadFieldType {
    DOCUMENT = "document",
    COMPANY_NAME = "company_name",
    TRADING_NAME = "trading_name",
    EMAIL = "email",
    ECONOMIC_ACTIVITY = "economic_activity",
    PHONE_NUMBER = "phone_number",
    CEP = "cep",
    CITY = "city",
    STATE = "state",
    COMPLEMENT = "complement",
    ADDRESS = "address",
    ADDRESS_NUMBER = "address_number",
    PERSONAL_NAME = "personal_name",
}

export interface CampaignResponse {
    campaign?: Campaign
    error?: string
}

export interface CampaignListResponse {
    campaigns?: PaginatedResponse<Campaign>
    error?: string
}

export function getCampaignStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, CampaignStatus)

    const campaignStatus = {
        [CampaignStatus.FORM_PENDING]: {
            color: "#2685E2",
            label: "Pendente",
            icon: QueryBuilderRounded,
        },
        [CampaignStatus.ACTIVE]: {
            color: "#118D57",
            label: "Ativo",
            icon: VerifiedRounded,
        },
        [CampaignStatus.INACTIVE]: {
            color: "#ff543f",
            label: "Inativo",
            icon: CancelRounded,
        },
    };

    return campaignStatus[value]
}

export function getCampaignTypeProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, CampaignType)

    const campaignType = {
        [CampaignType.LEAD]: {
            color: "#2685E2",
            label: "Lead de clientes",
            icon: AddReactionRoundedIcon,
        },
        [CampaignType.SALE]: {
            color: "#118D57",
            label: "Vendas",
            icon: AddchartRoundedIcon,
        },
    };

    return campaignType[value]
}

export async function loadCampaign(props: LoaderFunctionArgs): Promise<Campaign> {
    const response = await campaignUseCase.getCampaignByUUID(props.params?.uuid ?? "")

    if (response.error || !response.campaign) {
        throw new Response("campaign not found", {status: 404});
    }

    return response.campaign
}