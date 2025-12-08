import atomWithDebounce from "../../../functions/AtomWithDebounce.ts";
import {loadable} from "jotai/utils";
import {atom} from "jotai";
import {appBarRepository} from "../repository/AppBarRepository.ts";
import {atomEffect} from "jotai-effect";
import {connectWithWebSocket} from "../../../functions/WebSocketConnection.ts";
import {Message} from "stompjs";
import {Notification} from "../entities/entities.ts";
import TaskState from "../../../../module/tasks/state/TaskState.ts";
import {taskUseCase} from "../../../../module/tasks/usecase/TaskUseCase.ts";

const {
    debouncedValueAtom: SearchValueAtom
} = atomWithDebounce("", 500)

const SearchResultAtom = loadable(atom(async (get) => {
    const query = get(SearchValueAtom);

    return appBarRepository.queryMenuOptions(query);
}))

const SearchBarValueAtom = atom("")

const UpdateNotifications = atom(false)

const NotificationsAtom = atom<Notification[]>([])

const CountNotificationsAtom = atom<number>(0)

const NotificationIsReadFilter = atom<boolean | undefined>(undefined)

const NotificationWebSocketAtomEffect = atomEffect((get, set) => {
    const handleNotification = (message: Message) => {
        const notifications = get(NotificationsAtom)
        const currentCount = get(CountNotificationsAtom)

        const notification = JSON.parse(message.body) as Notification

        set(NotificationsAtom, [notification, ...notifications])

        set(CountNotificationsAtom, currentCount + 1)
    }

    connectWithWebSocket((client) => {
        client.subscribe(`/user/private/notifications`, handleNotification)
    })
})

const NotificationAtomEffect = atomEffect((get, set) => {
    const isRead = get(NotificationIsReadFilter)

    get(UpdateNotifications)

    appBarRepository.getNotifications(isRead).then((response) => {
        const temp = response?.notifications ?? []

        set(NotificationsAtom, temp)
        set(CountNotificationsAtom, temp.filter(x => !x.read).length)
    })
})

const NextTask = loadable(atom(async(get) => {
    get(TaskState.UpdateAtom)

    const task = await taskUseCase.getMyNextTask()

    return task.task
}))

export default {
    SearchValueAtom,
    SearchResultAtom,
    SearchBarValueAtom,

    NotificationsAtom,
    CountNotificationsAtom,
    NotificationWebSocketAtomEffect,
    NotificationAtomEffect,
    NotificationIsReadFilter,
    UpdateNotifications,
    NextTask
}