import {useSetAtom} from "jotai/index";
import CustomersState from "../state/CustomersState.ts";
import Kanban from "../../kanban/components/Kanban.tsx";
import {KanbanKeys} from "../../kanban/entities/entities.ts";

export const CustomersBoard = () => {
    const updateCustomerAtom = useSetAtom(CustomersState.UpdateAtom)

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
            <Kanban.Provider
                kanbanKey={KanbanKeys.LEADS}
                onChangeCallback={() => {
                    updateCustomerAtom(prev => !prev)
                }}
            />
        </div>
    )
}