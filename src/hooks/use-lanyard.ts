
"use client"
import { useEffect, useState, useRef } from 'react';

// From https://github.com/Phineas/lanyard-typings
export interface LanyardResponse {
    success: boolean;
    data?:    LanyardData;
    error?:   LanyardError;
}

export interface LanyardData {
    active_on_discord_web:   boolean;
    active_on_discord_desktop: boolean;
    active_on_discord_mobile: boolean;
    listening_to_spotify:    boolean;
    spotify:                 Spotify | null;
    discord_user:            DiscordUser;
    discord_status:          "online" | "idle" | "dnd" | "offline";
    activities:              Activity[];
    kv:                      Kv;
}

export interface Activity {
    id:            string;
    name:          string;
    type:          number;
    state?:        string;
    session_id?:   string;
    details?:      string;
    timestamps?:   Timestamps;
    assets?:       Assets;
    flags?:        number;
    created_at:    number;
    application_id?: string;
}

export interface Assets {
    large_text: string;
    large_image: string;
    small_text: string;
    small_image: string;
}

export interface Timestamps {
    start: number;
    end?: number;
}

export interface DiscordUser {
    username:       string;
    public_flags:   number;
    id:             string;
    discriminator:  string;
    bot:            boolean;
    avatar:         string;
}

export interface Kv {
    [key: string]: string;
}

export interface Spotify {
    track_id:     string;
    timestamps:   Timestamps;
    song:         string;
    artist:       string;
    album_art_url: string;
    album:        string;
}

export interface LanyardError {
    message: string;
    code:    string;
}

type LanyardMultiData = { [key: string]: LanyardData };

type LanyardOptions = {
    userId: string | string[];
};

enum Opcode {
    Event = 0,
    Hello = 1,
    Initialize = 2,
    Heartbeat = 3,
}

type SocketEvent = {
    op: Opcode;
    d?: any;
    t?: 'INIT_STATE' | 'PRESENCE_UPDATE';
};

export const useLanyard = ({ userId }: LanyardOptions) => {
    const [data, setData] = useState<LanyardMultiData | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        ws.current = new WebSocket('wss://api.lanyard.rest/socket');

        const onSocketMessage = (event: MessageEvent) => {
            const message: SocketEvent = JSON.parse(event.data);

            if (message.op === Opcode.Hello) {
                const heartbeatInterval = message.d.heartbeat_interval;
                setInterval(() => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        const heartbeat: SocketEvent = { op: Opcode.Heartbeat };
                        ws.current.send(JSON.stringify(heartbeat));
                    }
                }, heartbeatInterval);

                const init: SocketEvent = {
                    op: Opcode.Initialize,
                    d: {
                        subscribe_to_ids: Array.isArray(userId) ? userId : [userId],
                    },
                };
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify(init));
                }
            }

            if (message.op === Opcode.Event) {
                 if (message.t === 'INIT_STATE') {
                    setData(message.d as LanyardMultiData);
                } else if (message.t === 'PRESENCE_UPDATE') {
                    setData(prevData => ({
                        ...prevData,
                        [message.d.discord_user.id]: message.d as LanyardData
                    }));
                }
            }
        };

        ws.current.addEventListener('message', onSocketMessage);

        return () => {
            if (ws.current) {
                ws.current.removeEventListener('message', onSocketMessage);
                ws.current.close();
            }
        };
    }, [userId]);

    return { data };
};
