import {atom, useAtomValue, useSetAtom} from "jotai";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {loadable} from "jotai/utils";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Board} from "../entities/entities.ts";

const PageAtom = atom(0)
const FilterAtom = atom<CrmFilter | null>(null)
const OrderByAtom = atom<CrmOrderBy | null>({field: "title", ordenation: "asc"})
const UpdateAtom = atom(false)

const ListAtom = loadable(atom(async (get) => {
    get(UpdateAtom)

    const page = get(PageAtom);
    const filter = get(FilterAtom);
    const orderBy = get(OrderByAtom);

    return kanbanUseCase.getBoard(page, filter, orderBy)
}))

const ListTotalCountAtom = loadable(atom(async (get) => {
    const list = get(ListAtom);

    if (list.state === "hasData") {
        return list.data.total ?? 0;
    }

    return 0;
}));

const BoardAtom = atom<Board | null>(null)

const RuleAtomUUID = atom<string>("")

const useLoadBoard = () => {
    const {uuid} = useParams()
    const setBoard = useSetAtom(BoardAtom)

    const [loading, setLoading] = useState(true)

    const update = useAtomValue(UpdateAtom)

    useEffect(() => {
        if (!uuid) return

        kanbanUseCase.getBoardByUUID(uuid).then((r1) => {
            if (r1.board) {
                setBoard(r1.board)
            }
            setLoading(false)
        })
    }, [uuid, update])

    return {loading}
}

export default {
    PageAtom,
    FilterAtom,
    OrderByAtom,
    UpdateAtom,
    ListAtom,
    ListTotalCountAtom,
    BoardAtom,
    RuleAtomUUID,
    useLoadBoard
}