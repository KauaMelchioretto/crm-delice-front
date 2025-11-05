import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { dashboardRepository } from "../repository/DashboardRepository.ts";
import {
  DashboardCustomerValues,
  DashboardOrderValues,
  DashboardRankValues,
} from "../entities/entities.ts";

const UpdateAtom = atom(false);

const DashboardCustomerAtom = loadable(
  atom(async (get): Promise<DashboardCustomerValues> => {
    get(UpdateAtom); 
    return await dashboardRepository.getDashboardCustomer();
  })
);

const DashboardOrderAtom = loadable(
  atom(async (get): Promise<DashboardOrderValues> => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardOrder();
  })
);

const DashboardRankAtom = loadable(
  atom(async (get): Promise<DashboardRankValues> => {
    get(UpdateAtom);
    return await dashboardRepository.getDashboardRank();
  })
);

const DashboardTotalSoldAtom = loadable(
  atom(async (get): Promise<number> => {
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

export default {
  UpdateAtom,
  DashboardCustomerAtom,
  DashboardOrderAtom,
  DashboardRankAtom,
  DashboardTotalSoldAtom,
  DashboardMostWalletAtom,
  DashboardMostOperatorAtom,
};