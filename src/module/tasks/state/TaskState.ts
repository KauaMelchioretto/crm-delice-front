import {atom} from "jotai/index";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {taskUseCase} from "../usecase/TaskUseCase.ts";

const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null)
const UpdateAtom = atom(false)
const OrderByAtom = atom<CrmOrderBy | null>({ field: "code", ordenation: "asc" })

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    const page = get(PageAtom);
    const filter = get(FilterAtom);
    const orderBy = get(OrderByAtom)

    return taskUseCase.getTaskPagination(page, filter, orderBy)
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
    OrderByAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom,
}