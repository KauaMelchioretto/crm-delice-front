import {Board} from "../board/Board.tsx";
import {Board as BoardProps, Card, Column} from "../entities/entities.ts";
import {createContext, useContext, useEffect, useState} from "react";

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

export const Provider = () => {
    const [cards, setCards] = useState<Card[]>([
        {
            uuid: "hdinsduy232323",
            title: "Teste card 1",
            description: "Precisa mesmo de descricao?",
            columnUUID: "893724893u48jff",
            movable: true,
        },
        {
            uuid: "uy2hr92n39d32n7nd2",
            title: "Teste card 2",
            description: "Precisa mesmo de descricao?",
            columnUUID: "893724893u48jff",
            movable: false,
        }
    ]);

    const [columns] = useState<Column[]>([
        {
            uuid: "hj3en3iueh387e",
            code: "PENDING",
            title: "Pendente",
            allowedColumns: ["e873g2beydb7", "hj3en3iueh387e"]
        },
        {
            uuid: "893724893u48jff",
            code: "DOING",
            title: "Fazendo",
            allowedColumns: ["e873g2beydb7", "hj3en3iueh387e", "893724893u48jff"]
        },
        {
            uuid: "e873g2beydb7",
            code: "DONE",
            title: "Feito",
            allowedColumns: ["893724893u48jff", "e873g2beydb7"]
        },
        {
            uuid: "32r23432d32r23",
            code: "TESTE",
            title: "Teste",
            allowedColumns: ["893724893u48jff", "e873g2beydb7", "32r23432d32r23"]
        },
        {
            uuid: "dnf7d2n3dh32",
            code: "TESTE",
            title: "Teste",
            allowedColumns: ["893724893u48jff", "e873g2beydb7", "dnf7d2n3dh32"]
        },
        {
            uuid: "jcnuniu787",
            code: "TESTE",
            title: "Teste",
            allowedColumns: ["893724893u48jff", "e873g2beydb7", "jcnuniu787"]
        }
    ])

    const [board] = useState<BoardProps>({
        title: "Kanban",
        description: "teste",
        uuid: "uhifnudn32",
        code: "code"
    })

    const moveCard = (cardUUID: string, toColumnUUID: string) => {
        setCards(prev =>
            prev.map(card =>
                card.uuid === cardUUID ? {...card, columnUUID: toColumnUUID} : card
            )
        );
    };

    useEffect(() => {
        console.log(cards)
    }, [cards]);

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