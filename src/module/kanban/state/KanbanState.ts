import {atom} from "jotai";
import {CrmFilter} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";

const PageAtom = atom(0)
const FilterAtom = atom<CrmFilter | null>(null)
const UpdateAtom = atom(false)

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    const page = get(PageAtom);
    const filter = get(FilterAtom);

    return kanbanUseCase.getBoard(page, filter)
}))

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

export default {
    PageAtom,
    FilterAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom
}