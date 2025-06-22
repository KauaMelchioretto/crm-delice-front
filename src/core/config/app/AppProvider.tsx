import {createContext, ReactNode, useContext} from "react";
import {CrmFormType, CrmModules, CrmModule} from "../../../utils/entities/entities.ts";
import {Home} from "../../../module/home/page/Home.tsx";
import {User} from "../../../module/user/page/Users.tsx";
import {Modules} from "../../../module/modules/page/Modules.tsx";
import {NoPermissionPage} from "../../../utils/pages/NoPermissionPage.tsx";
import {Customers} from "../../../module/customer/page/Customers.tsx";
import {Wallets} from "../../../module/wallet/page/Wallets.tsx";
import {Me} from "../../auth/page/Me.tsx";
import {Product} from "../../../module/product/page/Product.tsx";
import HomeRounded from "@mui/icons-material/HomeRounded"
import {useTranslation} from "react-i18next";
import {UserForm} from "../../../module/user/components/UserForm.tsx";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {ModulesForm} from "../../../module/modules/components/ModulesForm.tsx";
import RuleRounded from "@mui/icons-material/RuleRounded";
import {CustomerForm} from "../../../module/customer/components/CustomerForm.tsx";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import {WalletForm} from "../../../module/wallet/components/WalletForm.tsx";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import {ProductForm} from "../../../module/product/components/ProductForm.tsx";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

interface AppContextProps {
    crmModules: CrmModule[]
}

interface AppProviderProps {
    children: ReactNode
}

const init: AppContextProps = {
    crmModules: []
}

const AppContext = createContext(init)

export const AppProvider = (props: AppProviderProps) => {
    const {t} = useTranslation()

    const modules: CrmModule[] = [
        {
            path: "/home",
            sideBar: true,
            element: <Home/>,
            permissionRequired: false,
            code: CrmModules.Home,
            icon: HomeRounded,
            label: t("modules.home")
        },
        {
            path: "/noPermission",
            sideBar: false,
            element: <NoPermissionPage/>,
            permissionRequired: false,
            code: CrmModules.NoPermission,
        },
        {
            path: "/user",
            sideBar: true,
            element: <User/>,
            permissionRequired: true,
            form: <UserForm/>,
            code: CrmModules.User,
            icon: AccountCircleRoundedIcon,
            label: t("modules.user"),
            createLabel: "Criar usuário",
            editFormType: CrmFormType.EDIT_USER,
            createFormType: CrmFormType.REGISTER_USER
        },
        {
            path: "/customers",
            sideBar: true,
            element: <Customers/>,
            permissionRequired: true,
            form: <CustomerForm/>,
            icon: PeopleAltRoundedIcon,
            label: t("modules.customers"),
            code: CrmModules.Customer,
            createLabel: "Criar cliente",
            editFormType: CrmFormType.EDIT_CUSTOMER,
            createFormType: CrmFormType.REGISTER_CUSTOMER
        },
        {
            path: "/wallets",
            sideBar: true,
            element: <Wallets/>,
            permissionRequired: true,
            form: <WalletForm/>,
            icon: WalletRoundedIcon,
            label: t("modules.wallet"),
            code: CrmModules.Wallet,
            createLabel: "Criar carteira",
            editFormType: CrmFormType.EDIT_WALLET,
            createFormType: CrmFormType.REGISTER_WALLET
        },
        {
            path: "/me",
            sideBar: false,
            element: <Me/>,
            permissionRequired: false,
            code: CrmModules.Me
        },
        {
            path: "/products",
            sideBar: true,
            element: <Product/>,
            permissionRequired: true,
            form: <ProductForm/>,
            icon: CategoryRoundedIcon,
            label: t("modules.product"),
            code: CrmModules.Product,
            createLabel: "Criar produto",
            editFormType: CrmFormType.EDIT_PRODUCT,
            createFormType: CrmFormType.REGISTER_PRODUCT
        },
        {
            path: "/modules",
            sideBar: true,
            element: <Modules/>,
            permissionRequired: true,
            form: <ModulesForm/>,
            icon: RuleRounded,
            label: t("modules.modules_config"),
            code: CrmModules.System,
        },
    ]

    return (
        <AppContext.Provider value={{crmModules: modules}}>
            {props.children}
        </AppContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(){
    return useContext(AppContext);
}