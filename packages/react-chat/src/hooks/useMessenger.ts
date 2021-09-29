// import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { Identity, Messenger } from "status-communities/dist/cjs";

import { ChatMessage } from "../models/ChatMessage";

export function useMessenger(chatId: string, chatIdList: string[]) {
    const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
    const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
        {}
    );
    const [notifications, setNotifications] = useState<{ [chatId: string]: number }>({})

    const clearNotifications = useCallback((id: string) => {
        setNotifications((prevNotifications) => {
            return {
                ...prevNotifications,
                [id]: 0
            }
        })
    }, [])

    const addNewMessage = useCallback(
        (sender: Uint8Array, content: string, date: Date, id: string) => {
            let signer = "0x";
            sender.forEach((e) => {
                signer = signer + e.toString(16);
            });
            setMessages((prevMessages) => {
                const newMessage = {
                    sender: signer,
                    content: content,
                    date: date,
                };
                if (prevMessages?.[id]) {
                    return {
                        ...prevMessages,
                        [id]: [...prevMessages[id], newMessage],
                    };
                } else {
                    return {
                        ...prevMessages,
                        [id]: [newMessage],
                    };
                }
            });
            if (chatId != id) {
                setNotifications((prevNotifications) => {
                    return {
                        ...prevNotifications,
                        [id]: prevNotifications[id] + 1
                    }
                })
            }
        },
        []
    );

    useEffect(() => {
        const createMessenger = async () => {
            const identity = Identity.generate();
            const messenger = await Messenger.create(identity);
            await new Promise((resolve) =>
                messenger.waku.libp2p.pubsub.once(
                    "pubsub:subscription-change",
                    () => resolve(null)
                )
            )
            await Promise.all(chatIdList.map(async (id) => {
                await messenger.joinChat(id);
                clearNotifications(id);
                messenger.addObserver((message) => {
                    addNewMessage(
                        message.signer ?? new Uint8Array(),
                        message.chatMessage?.text ?? "",
                        new Date(message.chatMessage?.proto.timestamp ?? 0),
                        id
                    );
                }, id);
            }))
            setMessenger(messenger);
        };
        createMessenger();
    }, []);

    const sendMessage = useCallback(
        async (messageText: string) => {
            await messenger?.sendMessage(messageText, chatId);
            addNewMessage(
                messenger?.identity.publicKey ?? new Uint8Array(),
                messageText,
                new Date(),
                chatId
            );
        },
        [chatId, messenger]
    );

    return { messenger, messages: messages?.[chatId] ?? [], sendMessage, notifications, clearNotifications };
}
