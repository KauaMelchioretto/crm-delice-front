import {atom} from "jotai";
import {ModulesFormType} from "../enitites/entities.ts";
import {modulesUseCase} from "../usecase/ModulesUseCase.ts";
import {loadable} from "jotai/utils";

const ModulesFormTypeAtom = atom<ModulesFormType>(ModulesFormType.EMPTY);

const ModuleFormUUIDAtom = atom("");

const ModuleUpdateAtom = atom(false);

const ModuleListAsyncAtom = atom(async (get) => {
    get(ModuleUpdateAtom);

    return modulesUseCase.getModules();
})

const ModuleListAtom = loadable(ModuleListAsyncAtom);

const AllRolesAsyncAtom = atom(async () => {
    return modulesUseCase.getAllRoles();
})

const AllRolesAtom = loadable(AllRolesAsyncAtom)

export default {
    ModulesFormTypeAtom,
    ModuleFormUUIDAtom,
    ModuleListAtom,
    ModuleUpdateAtom,
    AllRolesAtom
}