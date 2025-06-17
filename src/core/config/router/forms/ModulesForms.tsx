import {ReactElement} from "react";
import {CustomerForm} from "../../../../module/customer/components/CustomerForm.tsx";
import {UserForm} from "../../../../module/user/components/UserForm.tsx";
import {WalletForm} from "../../../../module/wallet/components/WalletForm.tsx";
import {ProductForm} from "../../../../module/product/components/ProductForm.tsx";
import {UserConfig} from "../../../auth/components/UserConfig.tsx";

interface ModulesForms {
    form: ReactElement
}

export const forms: ModulesForms[] = [
    {
        form: <UserForm/>
    },
    {
        form: <CustomerForm/>
    },
    {
        form: <WalletForm/>
    },
    {
        form: <ProductForm/>
    },
    {
        form: <UserConfig/>
    }
]