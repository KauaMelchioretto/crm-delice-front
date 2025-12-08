import {Lead, LeadListResponse, LeadResponse} from "../entities/entities.ts";
import {leadRepository} from "../repository/LeadRepository.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";

class LeadUseCase {
    async registerLead(lead: Lead): Promise<LeadResponse> {
        return leadRepository.registerLead(lead)
    }

    async approveLead(uuid: string): Promise<LeadResponse> {
        return leadRepository.approveLead(uuid)
    }

    async rejectLead(uuid: string): Promise<LeadResponse> {
        return leadRepository.rejectLead(uuid)
    }

    async getLeadByUUID(uuid: string): Promise<LeadResponse> {
        return leadRepository.getLeadByUUID(uuid)
    }

    async getLeadPagination(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<LeadListResponse> {
        return leadRepository.getLeadPagination(page, filter, orderBy)
    }
}

export const leadUseCase = new LeadUseCase()