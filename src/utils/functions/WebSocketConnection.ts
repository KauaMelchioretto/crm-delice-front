import {baseURL} from "../../core/config/api/baseURL.ts";
import {Client} from "@stomp/stompjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SockJS from "sockjs-client";

export function connectWithWebSocket(onConnectCallback?: (client: Client) => void): Client {
    const client = new Client({
        webSocketFactory: () => {
            const url = baseURL();
            let host = "";
            let protocol = "";

            if (url) {
                const newURL = new URL(url);
                host = `${newURL.hostname}:${newURL.port}`;
                protocol = "http";
            } else {
                host = new URL(document.location.href).hostname;
                protocol = "https";
            }
            return new SockJS(`${protocol}://${host}/ws`);
        },
        onConnect: () => {
            onConnectCallback?.(client);
        },
    });

    client.activate();
    return client;
}