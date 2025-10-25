import { atom } from "jotai";
import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities";
import { customersUseCase } from "../usecase/CustomersUseCase";
import { loadable } from "jotai/utils";

const UpdateAtom = atom(false);
const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null);
const OrderByAtom = atom<CrmOrderBy | null>({field: "company_name", sortable: "asc"});

const ListAtom = loadable(atom(async (get) => {
  get(UpdateAtom);

  const page = get(PageAtom);
  const filters = get(FilterAtom);
  const orderBy = get(OrderByAtom);

  return customersUseCase.getCustomers(page, filters, orderBy);
}));

const ListTotalCountAtom = loadable(atom(async (get) => {
  const list = get(ListAtom);
  if (list.state === "hasData") {
    return list.data.total ?? 0;
  }

  return 0;
}));

const SimpleCustomersAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    return customersUseCase.listSimpleCustomers()
}))

export default {
    PageAtom,
    FilterAtom,
    OrderByAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom,
    SimpleCustomersAtom,
}