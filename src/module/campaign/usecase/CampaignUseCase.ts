import {Campaign, CampaignListResponse, CampaignMetadata, CampaignResponse} from "../entities/entities.ts";
import {campaignRepository} from "../repository/CampaignRepository.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";

class CampaignUseCase {
    async createCampaign(campaign: Campaign): Promise<CampaignResponse> {
        return campaignRepository.createCampaign(campaign)
    }

    async saveCampaign(campaign: Campaign): Promise<CampaignResponse> {
        return campaignRepository.saveCampaign(campaign)
    }

    async getCampaignByUUID(uuid: string): Promise<CampaignResponse> {
        return campaignRepository.getCampaignByUUID(uuid)
    }

    async getVisitCampaignByUUID(uuid: string): Promise<CampaignResponse> {
        return campaignRepository.getVisitCampaignByUUID(uuid)
    }

    async saveCampaignMetadata(campaignUUID: string, metadata: CampaignMetadata): Promise<CampaignResponse> {
        return campaignRepository.saveCampaignMetadata(campaignUUID, metadata)
    }

    async getCampaigns(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<CampaignListResponse> {
        return campaignRepository.getCampaigns(page, filter, orderBy)
    }
}

export const campaignUseCase = new CampaignUseCase();