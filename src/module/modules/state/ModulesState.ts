import {atom} from "jotai";
import {ModulesFormType} from "../enitites/entities.ts";
import {modulesUseCase} from "../usecase/ModulesUseCase.ts";
import {loadable} from "jotai/utils";
import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities.ts";

const ModulesFormTypeAtom = atom<ModulesFormType>(ModulesFormType.EMPTY);
const PageAtom = atom(0)
const FilterAtom = atom<CrmFilter | null>(null);
const OrderByAtom = atom<CrmOrderBy | null>({field: "code", ordenation: "asc"})
const ModuleFormUUIDAtom = atom("");

const ModuleUpdateAtom = atom(false);

const ModuleListAtom = loadable(atom(async (get) => {
    get(ModuleUpdateAtom);

    const page = get(PageAtom)
    const filter = get(FilterAtom);
    const orderBy = get(OrderByAtom);

    return modulesUseCase.getModules(page, filter, orderBy);
}));

const ModulesListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ModuleListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}))

const AllRolesAsyncAtom = atom(async () => {
    return modulesUseCase.getAllRoles();
})

const AllRolesAtom = loadable(AllRolesAsyncAtom)

export default {
    ModulesFormTypeAtom,
    ModuleFormUUIDAtom,
    ModulesListTotalCountAtom,
    ModuleListAtom,
    ModuleUpdateAtom,
    AllRolesAtom,
    PageAtom,
    FilterAtom,
    OrderByAtom
}