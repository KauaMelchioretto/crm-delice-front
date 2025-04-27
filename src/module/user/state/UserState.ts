import { atom } from "jotai";
import { usersUseCase } from "../usecase/UsersUseCase.ts";
import { loadable } from "jotai/utils";
import { UsersFormType } from "../entities/entities.ts";

const UserFormTypeAtom = atom<UsersFormType>(UsersFormType.EMPTY);

const UserFormUUIDAtom = atom("");

const UserUpdateAtom = atom(false);

const UsersListAsyncAtom = atom(async (get) => {
    get(UserUpdateAtom);
    const page = get(UserListPage);

    return usersUseCase.getUsers(page);
})

const UsersListAtom = loadable(UsersListAsyncAtom);

const UserListPage = atom(0);

export default {
    UserFormTypeAtom,
    UserFormUUIDAtom,
    UsersListAtom,
    UserUpdateAtom,
    UserListPage
}