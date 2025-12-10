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
import {UserConfig} from "../../auth/components/UserConfig.tsx";
import {BoardPage} from "../../../module/kanban/page/BoardPage.tsx";
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import {BoardForm} from "../../../module/kanban/components/BoardForm.tsx";
import {RulePage} from "../../../module/kanban/page/RulePage.tsx";
import {RuleForm} from "../../../module/kanban/components/RuleForm.tsx";
import {Order} from "../../../module/order/page/Order.tsx";
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import {OrderForm} from "../../../module/order/components/OrderForm.tsx";
import {OrderDetails} from "../../../module/order/page/OrderDetails.tsx";
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import {Tasks} from "../../../module/tasks/page/Tasks.tsx";
import {TaskForm} from "../../../module/tasks/components/TaskForm.tsx";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';

import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import {CustomersBoard} from "../../../module/customer/page/CustomersBoard.tsx";
import {CrmCalendar} from "../../../module/tasks/page/Calendar.tsx";

import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import {Campaign} from "../../../module/campaign/page/Campaign.tsx";
import {CampaignForm} from "../../../module/campaign/components/CampaignForm.tsx";
import {CampaignData} from "../../../module/campaign/page/CampaignData.tsx";

import FaceRetouchingNaturalRoundedIcon from '@mui/icons-material/FaceRetouchingNaturalRounded';
import {Leads} from "../../../module/lead/page/Leads.tsx";

interface AppContextProps {
    crmModules: CrmModule[],
    getModuleByCode: (code: CrmModules) => CrmModule
}

interface AppProviderProps {
    children: ReactNode
}

const init: AppContextProps = {
    crmModules: [],
    getModuleByCode: () => {
        throw new Error("method not implemented")
    }
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
            label: t("modules.users"),
            createLabel: t("users.page.buttons.register"),
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
            createLabel: t("customers.page.buttons.register"),
            editFormType: CrmFormType.EDIT_CUSTOMER,
            createFormType: CrmFormType.REGISTER_CUSTOMER
        },
        {
            path: "/lead",
            sideBar: true,
            element: <Leads/>,
            permissionRequired: true,
            // form: <CustomerForm/>,
            icon: FaceRetouchingNaturalRoundedIcon,
            label: "Leads",
            code: CrmModules.Leads,
        },
        {
            path: "/customersBoard",
            sideBar: true,
            element: <CustomersBoard/>,
            permissionRequired: true,
            icon: LeaderboardRoundedIcon,
            label: t("modules.customers_board"),
            code: CrmModules.CustomerBoard,
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
            createLabel: t("wallets.page.buttons.register"),
            editFormType: CrmFormType.EDIT_WALLET,
            createFormType: CrmFormType.REGISTER_WALLET
        },
        {
            path: "/orders",
            sideBar: true,
            element: <Order/>,
            permissionRequired: true,
            form: <OrderForm/>,
            icon: ContentPasteRoundedIcon,
            label: t("modules.order"),
            code: CrmModules.Order,
        },
        {
            path: "/orders/:uuid",
            sideBar: false,
            element: <OrderDetails/>,
            permissionRequired: true,
            icon: ContentPasteRoundedIcon,
            label: t("modules.order"),
            code: CrmModules.OrderItems,
        },
        {
            path: "/me",
            sideBar: false,
            element: <Me/>,
            permissionRequired: false,
            code: CrmModules.Me,
            form: <UserConfig/>
        },
        {
            path: "/products",
            sideBar: true,
            element: <Product/>,
            permissionRequired: true,
            form: <ProductForm/>,
            icon: CategoryRoundedIcon,
            label: t("modules.products"),
            code: CrmModules.Product,
            createLabel: t("products.page.buttons.register"),
            editFormType: CrmFormType.EDIT_PRODUCT,
            createFormType: CrmFormType.REGISTER_PRODUCT
        },
        {
            path: "/campaign",
            sideBar: true,
            element: <Campaign/>,
            permissionRequired: true,
            icon: AutoGraphRoundedIcon,
            label: t("modules.campaign"),
            code: CrmModules.Campaign,
            form: <CampaignForm/>
        },
        {
            path: "/campaign/:uuid",
            sideBar: false,
            element: <CampaignData/>,
            permissionRequired: true,
            icon: AutoGraphRoundedIcon,
            label: t("modules.campaign"),
            code: CrmModules.CampaignData,
        },
        {
            path: "/kanban",
            sideBar: true,
            element: <BoardPage/>,
            permissionRequired: true,
            icon: ViewKanbanRoundedIcon,
            label: t("modules.kanbans"),
            code: CrmModules.Kanban,
            form: <BoardForm/>
        },
        {
            path: "/tasks",
            sideBar: true,
            permissionRequired: true,
            icon: TaskAltRoundedIcon,
            label: t("modules.tasks"),
            code: CrmModules.Task,
            element: <Tasks/>,
            form: <TaskForm/>
        },
        {
            path: "/calendar",
            sideBar: true,
            permissionRequired: true,
            icon: TodayRoundedIcon,
            label: t("modules.calendar"),
            code: CrmModules.Calendar,
            element: <CrmCalendar/>
        },
        {
            path: "/kanban/:uuid",
            sideBar: false,
            element: <RulePage/>,
            permissionRequired: true,
            icon: LanRoundedIcon,
            label: t("modules.kanbans"),
            code: CrmModules.KanbanRule,
            form: <RuleForm/>
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

    const getModuleByCode = (code: CrmModules) => {
        const m = modules.find(x => x.code == code)

        if(!m) throw new Error("invalid module code")

        return m
    }

    return (
        <AppContext.Provider value={{crmModules: modules, getModuleByCode}}>
            {props.children}
        </AppContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(){
    return useContext(AppContext);
}