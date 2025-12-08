import {Campaign, CampaignListResponse, CampaignMetadata, CampaignResponse} from "../entities/entities.ts";
import {handleRequest} from "../../../utils/functions/HandleAxios.ts";
import {http} from "../../../core/config/api/http.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";

class CampaignRepository {
    async createCampaign(campaign: Campaign): Promise<CampaignResponse> {
        return handleRequest(
            http.post("/campaign/create", campaign)
        )
    }

    async saveCampaign(campaign: Campaign): Promise<CampaignResponse> {
        return handleRequest(
            http.put("/campaign/update", campaign)
        )
    }

    async getCampaignByUUID(uuid: string): Promise<CampaignResponse> {
        return handleRequest(
            http.get(`/campaign/${uuid}`)
        )
    }

    async getVisitCampaignByUUID(uuid: string): Promise<CampaignResponse> {
        return handleRequest(
            http.get(`/campaign/visit/${uuid}`)
        )
    }

    async saveCampaignMetadata(campaignUUID: string, metadata: CampaignMetadata): Promise<CampaignResponse> {
        return handleRequest(
            http.post(`/campaign/metadata/${campaignUUID}`, metadata)
        )
    }

    async getCampaigns(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<CampaignListResponse> {
        let query = "";

        if (filter?.field) {
            query += `&${filter.field}=${filter.value}`;
        } else if (!filter?.field && filter?.value) {
            query += `&allFields=${filter?.value}`;
        }

        if (orderBy?.field) {
            query += `&orderBy=${orderBy?.field}:${orderBy?.sortable}`;
        } else {
            query += `&orderBy=title`;
        }

        return handleRequest(
            http.get(`/campaign/getPagination?count=10&page=${page}${query}`)
        )
    }
}

export const campaignRepository = new CampaignRepository();