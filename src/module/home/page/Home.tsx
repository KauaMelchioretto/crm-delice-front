import Kanban from "../../kanban/components/Kanban.tsx";
import {KanbanKeys} from "../../kanban/entities/entities.ts";

export const Home = () => {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Kanban.Provider kanbanKey={KanbanKeys.LEADS} />
        </div>
    )
}