import Kanban from "../../../utils/components/kanban/Kanban.tsx";

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
            <Kanban.Provider/>
        </div>
    )
}