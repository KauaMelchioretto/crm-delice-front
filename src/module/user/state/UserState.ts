import {atom} from "jotai";
import {usersUseCase} from "../usecase/UsersUseCase.ts";
import {loadable} from "jotai/utils";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {atomEffect} from "jotai-effect";
import {OptionType} from "../../../utils/components/core/SelectInput.tsx";

const PageAtom = atom(0);
const UpdateAtom = atom(false);
const FilterAtom = atom<CrmFilter | null>(null);
const OrderByAtom = atom<CrmOrderBy | null>({field: "login", ordenation: "asc"});

const ListAtom = loadable(atom(async (get) => {
        get(UpdateAtom);

        const page = get(PageAtom);
        const filters = get(FilterAtom);
        const orderBy = get(OrderByAtom);

        return usersUseCase.getUsers(page, filters, orderBy);
    })
);

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);
    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

const SimpleUsersAtom = atom<OptionType[]>([]);

const SimpleUsersAtomEffect = atomEffect((get, set) => {
    get(UpdateAtom);

    usersUseCase.listSimpleUsers().then((response) => {
        set(SimpleUsersAtom, response.users?.map(u => ({
            value: u.uuid ?? "",
            label: u.login ?? ""
        })) ?? [])
    })
})

export default {
    PageAtom,
    ListAtom,
    ListTotalCountAtom,
    UpdateAtom,
    FilterAtom,
    OrderByAtom,
    SimpleUsersAtom,
    SimpleUsersAtomEffect
};
