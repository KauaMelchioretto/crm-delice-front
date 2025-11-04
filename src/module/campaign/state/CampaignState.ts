import {atom} from "jotai";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {campaignUseCase} from "../usecase/CampaignUseCase.ts";

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


export default {
    UpdateAtom,
    PageAtom,
    FilterAtom,
    OrderByAtom,
    ListAtom,
    ListTotalCountAtom,
}