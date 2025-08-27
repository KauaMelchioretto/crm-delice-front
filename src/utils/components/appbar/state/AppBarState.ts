import atomWithDebounce from "../../../functions/AtomWithDebounce.ts";
import {loadable} from "jotai/utils";
import {atom} from "jotai";
import {appBarRepository} from "../repository/AppBarRepository.ts";
import {atomEffect} from "jotai-effect";
import {connectWithWebSocket} from "../../../functions/WebSocketConnection.ts";
import {Message} from "stompjs";
import {Notification} from "../entities/entities.ts";

const {
    debouncedValueAtom: SearchValueAtom
} = atomWithDebounce("", 500)

const SearchResultAtom = loadable(atom(async (get) => {
    const query = get(SearchValueAtom);

    return appBarRepository.queryMenuOptions(query);
}))

const SearchBarValueAtom = atom("")

const NotificationsAtom = atom<Notification[]>([])

const CountNotificationsAtom = atom<number>(0)

const NotificationAtomEffect = atomEffect((get, set) => {
    const handleNotification = (message: Message) => {
        const notifications = get(NotificationsAtom)

        const notification = JSON.parse(message.body) as Notification

        set(NotificationsAtom, [...notifications, notification])

        set(CountNotificationsAtom, notifications.length + 1)
    }

    connectWithWebSocket((client) => {
        client.subscribe(`/user/private/notifications`, handleNotification)
    })
})

export default {
    SearchValueAtom,
    SearchResultAtom,
    SearchBarValueAtom,

    NotificationsAtom,
    CountNotificationsAtom,
    NotificationAtomEffect,
}