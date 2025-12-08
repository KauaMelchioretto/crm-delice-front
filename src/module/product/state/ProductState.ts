import {atom} from "jotai";
import {CrmOrderBy, CrmFilter} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {productUseCase} from "../usecase/ProductUseCase.ts";
import {atomEffect} from "jotai-effect";
import {OptionType} from "../../../utils/components/core/SelectInput.tsx";

const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null)
const UpdateAtom = atom(false)
const OrderByAtom = atom<CrmOrderBy | null>({field: "code", sortable: "asc"})

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

const SimpleProducts = atom<OptionType[]>([])

const SimpleProductsAtomEffect = atomEffect((get, set) => {
    get(UpdateAtom)

    productUseCase.getSimpleProducts().then((response) => {
        set(SimpleProducts, response.products?.map(x => ({
            label: x.name ?? "",
            value: x.uuid ?? ""
        })) ?? [])
    })
})

export default {
    PageAtom,
    FilterAtom,
    OrderByAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom,
    SimpleProducts,
    SimpleProductsAtomEffect
}