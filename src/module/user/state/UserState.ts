import {atom} from "jotai";
import {usersUseCase} from "../usecase/UsersUseCase.ts";
import {loadable} from "jotai/utils";
import {CrmFilter} from "../../../utils/entities/entities.ts";

const UserUpdateAtom = atom(false);

const UsersListAsyncAtom = atom(async (get) => {
    get(UserUpdateAtom);
    const page = get(UserListPage);

    const filters = get(UserFilterAtom);

    return usersUseCase.getUsers(page, filters);
});

const UsersListAtom = loadable(UsersListAsyncAtom);

const UserListTotalCountAsyncAtom = atom(async (get) => {
    const list = get(UsersListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
});

const UserListTotalCountAtom = loadable(UserListTotalCountAsyncAtom);

const UserListPage = atom(0);

const UserFilterAtom = atom<CrmFilter | null>(null)

const SimpleUsersAtom = loadable(atom(async (get) => {
    get(UserUpdateAtom);

    return usersUseCase.listSimpleUsers()
}))

export default {
    UsersListAtom,
    UserUpdateAtom,
    UserListTotalCountAtom,
    UserListPage,
    UserFilterAtom,
    SimpleUsersAtom
};
