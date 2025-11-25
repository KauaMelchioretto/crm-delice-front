import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { dashboardRepository } from "../repository/DashboardRepository.ts";
const UpdateAtom = atom(false);

const DashboardCustomerAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom); 
    return await dashboardRepository.getDashboardCustomer();
  })
);

const DashboardOrderAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardOrder();
  })
);

const DashboardRankBestAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardRankBest();
  })
);

const DashboardRankLessAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardRankLess();
  })
);

const DashboardTotalSoldAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardTotalSold();
  })
);

const DashboardMostWalletAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardMostWalletSold();
  })
);

const DashboardMostOperatorAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardMostOperatorSold();
  })
);

const DashboardMonthSoldAtom = loadable(
  atom(async (get) => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardMonthSold();
  })
);

export default {
  UpdateAtom,
  DashboardCustomerAtom,
  DashboardOrderAtom,
  DashboardRankBestAtom,
  DashboardRankLessAtom,
  DashboardTotalSoldAtom,
  DashboardMostWalletAtom,
  DashboardMostOperatorAtom,
  DashboardMonthSoldAtom,
};