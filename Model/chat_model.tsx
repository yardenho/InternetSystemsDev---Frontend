import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    accessToken: string;
    id: string;
};

export type Message = {
    sender: String;
    message: String;
    image: String;
    senderId: String;
};
