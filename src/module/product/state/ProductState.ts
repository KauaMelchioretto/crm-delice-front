import {atom} from "jotai";
import {CrmOrderBy, CrmFilter} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {productUseCase} from "../usecase/ProductUseCase.ts";

const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null)
const UpdateAtom = atom(false)
const OrderByAtom = atom<CrmOrderBy | null>({ field: "code", ordenation: "asc" })

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    const page = get(PageAtom);
    const filter = get(FilterAtom);
    const orderBy = get(OrderByAtom)

    return productUseCase.getProduct(page, filter, orderBy)
}))

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

const SimpleProducts = loadable(atom(async (get) => {
    get(UpdateAtom)

    return productUseCase.getSimpleProducts()
}))

export default {
    PageAtom,
    FilterAtom,
    OrderByAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom,
    SimpleProducts
}