import {useAtom} from "jotai";
import UserState from "../../../module/user/state/UserState.ts";
import CustomersState from "../../../module/customer/state/CustomersState.ts";

export const InitAtoms = () => {
    useAtom(UserState.SimpleUsersAtomEffect)
    useAtom(CustomersState.SimpleCustomersAtomEffect)

    return <></>
}