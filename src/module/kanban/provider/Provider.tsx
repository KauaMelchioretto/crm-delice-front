import {Board} from "../components/board/Board.tsx";
import {Board as BoardProps, Card, Column} from "../entities/entities.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {useAtomValue} from "jotai";
import KanbanState from "../state/KanbanState.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {CardDialog} from "../components/card/CardDialog.tsx";

type ProviderContextType = {
    columns: Column[];
    cards: Card[];
    moveCard: (cardUUID: string, toColumnUUID: string) => void;
};

const ProviderContext = createContext<ProviderContextType | null>(null)

export function useKanban() {
    const context = useContext(ProviderContext);

    if (!context) throw new Error("invalid use of useKanban, context is empty")

    return context
}

interface ProviderProps {
    kanbanKey: string,
    onChangeCallback?: () => void
}

export const Provider = (props: ProviderProps) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [columns, setColumns] = useState<Column[]>([])
    const [board, setBoard] = useState<BoardProps | null>(null)

    useAtomValue(KanbanState.UpdateAtom)

    const moveCard = (cardUUID: string, toColumnUUID: string) => {
        const card = cards.find(x => x.uuid === cardUUID)!

        setCards(prev => prev.filter(x =>
            x.uuid !== cardUUID
        ));

        kanbanUseCase.moveCardToColumn(cardUUID, toColumnUUID).then((response) => {
            if (response.cards) {
                setCards(response.cards)

                if (props.onChangeCallback) {
                    props.onChangeCallback()
                }
            } else {
                popup.toast("warning", response.error as string, 2000).then()
                setCards(prev => [...prev, card]);
            }
        })
    };

    useEffect(() => {
        kanbanUseCase.getBoardByKey(props.kanbanKey).then((response) => {
            if (response.board) {
                setBoard(response.board)
                setColumns(response.board?.columns ?? [])
                setCards(response.board?.cards ?? [])
            }
        })
    }, [props]);

    if (!board) return

    return (
        <ProviderContext.Provider
            value={{
                columns,
                cards,
                moveCard
            }}
        >
            <Board {...board}/>
            <CardDialog/>
        </ProviderContext.Provider>
    )
}