import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { CrmFilter } from "../../../utils/entities/entities";
import { mapRepository } from "../repository/MapRepository";

const MapUpdateAtom = atom(false);
const MapFilterAtom = atom<CrmFilter | null>(null);

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
        endDate: "endDate",
        state: "state"
    };
    
    const paramName = fieldMapping[filter.field] || filter.field;
    
    return filter.value ? { [paramName]: filter.value } : {};
};

const CustomersByStateAtom = loadable(
    atom(async (get) => {
        get(MapUpdateAtom);
        const filter = get(MapFilterAtom);
        const params = filterToParams(filter);
        return await mapRepository.getCustomersByState(params);
    })
);

export default {
    MapUpdateAtom,
    MapFilterAtom,
    CustomersByStateAtom,
};