import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { dashboardRepository } from "../repository/DashboardRepository.ts";
import { CrmFilter } from "../../../utils/entities/entities.ts";

const UpdateAtom = atom(false);
const FilterAtom = atom<CrmFilter | null>(null);


const filterToParams = (filter: CrmFilter | null): Record<string, string> => {
    if (!filter || !filter.field) return {};
    
    if (filter.field === "allFields") {
        return filter.value ? { allFields: filter.value } : {};
    }
    
    const fieldMapping: Record<string, string> = {
        customerName: "customerName",
        walletName: "walletName", 
        operatorName: "operatorName",
        monthYear: "monthYear",
        startDate: "startDate",
        endDate: "endDate"
    };
    
    const paramName = fieldMapping[filter.field] || filter.field;
    
    // REMOVER encodeURIComponent daqui - apenas retorne o valor original
    return filter.value ? { [paramName]: filter.value } : {};
};

const DashboardCustomerAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom); 
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardCustomer(params);
  })
);

const DashboardOrderAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardOrder(params);
  })
);

const DashboardRankBestAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardRankBest(params);
  })
);

const DashboardRankLessAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardRankLess(params);
  })
);

const DashboardTotalSoldAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardTotalSold(params);
  })
);

const DashboardMostWalletAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardMostWalletSold(params);
  })
);

const DashboardMostOperatorAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardMostOperatorSold(params);
  })
);

const DashboardMonthSoldAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    const filter = get(FilterAtom);
    const params = filterToParams(filter);
    return await dashboardRepository.getDashboardMonthSold(params);
  })
);

export default {
  UpdateAtom,
  FilterAtom,
  DashboardCustomerAtom,
  DashboardOrderAtom,
  DashboardRankBestAtom,
  DashboardRankLessAtom,
  DashboardTotalSoldAtom,
  DashboardMostWalletAtom,
  DashboardMostOperatorAtom,
  DashboardMonthSoldAtom,
};