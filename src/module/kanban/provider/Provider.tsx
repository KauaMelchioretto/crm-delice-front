import {Board} from "../components/board/Board.tsx";
import {Board as BoardProps, Card, Column} from "../entities/entities.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {useAtomValue} from "jotai";
import KanbanState from "../state/KanbanState.ts";

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
    kanbanKey: string
}

export const Provider = (props: ProviderProps) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [columns, setColumns] = useState<Column[]>([])
    const [board, setBoard] = useState<BoardProps | null>(null)

    useAtomValue(KanbanState.UpdateAtom)

    const moveCard = (cardUUID: string, toColumnUUID: string) => {
        setCards(prev =>
            prev.map(card =>
                card.uuid === cardUUID ? {...card, columnUUID: toColumnUUID} : card
            )
        );
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
        </ProviderContext.Provider>
    )
}