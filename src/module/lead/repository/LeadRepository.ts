import {Lead, LeadListResponse, LeadResponse} from "../entities/entities.ts";
import {handleRequest} from "../../../utils/functions/HandleAxios.ts";
import {http} from "../../../core/config/api/http.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";

class LeadRepository {
    async registerLead(lead: Lead): Promise<LeadResponse> {
        return handleRequest(
            http.post("/lead/save", lead)
        )
    }

    async approveLead(uuid: string): Promise<LeadResponse> {
        return handleRequest(
            http.put(`/lead/approve/${uuid}`)
        )
    }

    async rejectLead(uuid: string): Promise<LeadResponse> {
        return handleRequest(
            http.put(`/lead/reprove/${uuid}`)
        )
    }

    async getLeadPagination(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<LeadListResponse> {
        let query = "";

        if (filter?.field) {
            query += `&${filter.field}=${filter.value}`;
        } else if (!filter?.field && filter?.value) {
            query += `&allFields=${filter?.value}`;
        }

        if (orderBy?.field) {
            query += `&orderBy=${orderBy?.field}:${orderBy?.sortable}`;
        }

        return handleRequest(
            http.get(`/lead/getPagination?count=10&page=${page}${query}`)
        )
    }
}

export const leadRepository = new LeadRepository()