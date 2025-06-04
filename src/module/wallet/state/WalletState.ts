import {loadable} from "jotai/utils";
import {atom} from "jotai";
import {walletUseCase} from "../usecase/WalletUseCase.ts";
import {CrmFilter} from "../../../utils/entities/entities.ts";
import {WalletFormType} from "../entities/entities.ts";

const UpdateAtom = atom(false)
const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null)

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    const page = get(PageAtom);
    const filter = get(FilterAtom);

    return walletUseCase.getWallets(page, filter)
}))

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

const FormTypeAtom = atom<WalletFormType>(WalletFormType.EMPTY);

const CurrentUUIDAtom = atom("")

export default {
    UpdateAtom,
    PageAtom,
    FilterAtom,
    ListAtom,
    ListTotalCountAtom,
    FormTypeAtom,
    CurrentUUIDAtom
}