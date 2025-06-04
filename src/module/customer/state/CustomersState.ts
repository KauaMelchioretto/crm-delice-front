import { atom } from "jotai";
import { CustomerFormType } from "../entities/entities.ts";
import { CrmFilter } from "../../../utils/entities/entities";
import { customersUseCase } from "../usecase/CustomersUseCase";
import { loadable } from "jotai/utils";

const CustomerFormTypeAtom = atom<CustomerFormType>(CustomerFormType.EMPTY);

const CustomerFormUUIDAtom = atom("");

const CustomerUpdateAtom = atom(false);

const CustomersListPage = atom(0);

const CustomerFilterAtom = atom<CrmFilter | null>(null);

const CustomersListAsyncAtom = atom(async (get) => {
  get(CustomerUpdateAtom);

  const page = get(CustomersListPage);

  const filters = get(CustomerFilterAtom);

  return customersUseCase.getCustomers(page, filters);
});

const CustomersListAtom = loadable(CustomersListAsyncAtom);

const CustomersListTotalCountAsyncAtom = atom(async (get) => {
  const list = get(CustomersListAtom);
  if (list.state === "hasData") {
    return list.data.total ?? 0;
  }

  return 0;
});

const CustomersListTotalCountAtom = loadable(CustomersListTotalCountAsyncAtom);

const SimpleCustomersAtom = loadable(atom(async (get) => {
    get(CustomerUpdateAtom)

    return customersUseCase.listSimpleCustomers()
}))

export default {
    CustomerFormTypeAtom,
    CustomerFormUUIDAtom,
    CustomerUpdateAtom,
    CustomersListAtom,
    CustomerFilterAtom,
    CustomersListTotalCountAtom,
    CustomersListPage,
    SimpleCustomersAtom
}