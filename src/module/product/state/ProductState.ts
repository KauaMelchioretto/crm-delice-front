import {atom} from "jotai";
import {ProductFormType} from "../entities/entities.ts";
import {CrmFilter} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {productUseCase} from "../usecase/ProductUseCase.ts";

const FormType = atom<ProductFormType>(ProductFormType.EMPTY)

const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null)
const UpdateAtom = atom(false)

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    const page = get(PageAtom);
    const filter = get(FilterAtom);

    return productUseCase.getProduct(page, filter)
}))

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

const CurrentUUIDAtom = atom("")

export default {
    FormType,
    PageAtom,
    FilterAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom,
    CurrentUUIDAtom
}