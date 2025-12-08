import {useParams} from "react-router-dom";
import {useEffect, useTransition} from "react";
import {orderUseCase} from "../usecase/OrderUseCase.ts";
import {atom, useAtom, useAtomValue} from "jotai";
import {Order as OrderEntity, OrderItem} from "../entities/entities.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {useSetAtom} from "jotai/index";

const Order = atom<OrderEntity | null>(null)

const OrderItems = atom<OrderItem[]>([])

const UpdateAtom = atom(false);
const PageAtom = atom(0);
const FilterAtom = atom<CrmFilter | null>(null);
const OrderByAtom = atom<CrmOrderBy | null>({field: "code", sortable: "asc"});

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom);

    const page = get(PageAtom);
    const filters = get(FilterAtom);
    const orderBy = get(OrderByAtom);

    return orderUseCase.getPaginatedOrder(page, filters, orderBy);
}));

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);
    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

const useOrderDetails = () => {
    const orderUUID = useParams()?.uuid ?? ""
    const [order, setOrder] = useAtom(Order);
    const setOrderItems = useSetAtom(OrderItems);

    const update = useAtomValue(UpdateAtom);

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const response = await orderUseCase.getOrderByUUID(orderUUID)

            if (response.order) {
                setOrder(response.order)
                setOrderItems(response.order.items ?? [])
            }
        })
    }, [orderUUID, update]);

    return {isPending, order}
}

export default {
    Order,
    OrderItems,
    useOrderDetails,
    UpdateAtom,
    PageAtom,
    FilterAtom,
    OrderByAtom,
    ListAtom,
    ListTotalCountAtom,
}