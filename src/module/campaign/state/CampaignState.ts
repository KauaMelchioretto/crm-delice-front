import {atom} from "jotai";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {campaignUseCase} from "../usecase/CampaignUseCase.ts";
import {useParams} from "react-router-dom";
import {useAtom, useAtomValue} from "jotai/index";
import {useEffect, useTransition} from "react";
import {Campaign as CampaignEntity} from "../entities/entities.ts";

const UpdateAtom = atom(false)
const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null);
const OrderByAtom = atom<CrmOrderBy | null>({field: "title", sortable: "asc"});

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom);

    const page = get(PageAtom);
    const filters = get(FilterAtom);
    const orderBy = get(OrderByAtom);

    return campaignUseCase.getCampaigns(page, filters, orderBy);
}));

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);
    if (list.state === "hasData") {
        return list.data.campaigns?.total ?? 0;
    }

    return 0;
}));

const Campaign = atom<CampaignEntity | null>(null)

const useCampaignDetails = () => {
    const campaignUUID = useParams()?.uuid ?? ""
    const [campaign, setCampaign] = useAtom(Campaign);
    const update = useAtomValue(UpdateAtom);

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const response = await campaignUseCase.getCampaignByUUID(campaignUUID)

            if (response.campaign) {
                setCampaign(response.campaign)
            }
        })
    }, [campaignUUID, update]);

    return {isPending, campaign}
}

export default {
    UpdateAtom,
    PageAtom,
    FilterAtom,
    OrderByAtom,
    ListAtom,
    ListTotalCountAtom,
    useCampaignDetails
}