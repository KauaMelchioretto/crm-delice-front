import {useAtom} from "jotai";
import UserState from "../../../module/user/state/UserState.ts";
import CustomersState from "../../../module/customer/state/CustomersState.ts";
import ProductState from "../../../module/product/state/ProductState.ts";

export const InitAtoms = () => {
    useAtom(UserState.SimpleUsersAtomEffect)
    useAtom(CustomersState.SimpleCustomersAtomEffect)
    useAtom(ProductState.SimpleProductsAtomEffect)

    return <></>
}