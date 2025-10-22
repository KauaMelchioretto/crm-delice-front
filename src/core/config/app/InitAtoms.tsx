import {useAtom} from "jotai";
import UserState from "../../../module/user/state/UserState.ts";

export const InitAtoms = () => {
    useAtom(UserState.SimpleUsersAtomEffect)

    return <></>
}