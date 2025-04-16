import {atom} from "jotai";
// import { UsersUseCase } from "../usecase/UsersUseCase.ts";
import {loadable} from "jotai/utils";
import { UsersFormType } from "../entities/entities.ts";

const UserFormTypeAtom = atom<UsersFormType>(UsersFormType.EMPTY);

const UserFormUUIDAtom = atom("");

const UserUpdateAtom = atom(false);

const UserListAsyncAtom = atom(async (get) => {
    get(UserUpdateAtom);

    //return UsersUseCase.getUser
})