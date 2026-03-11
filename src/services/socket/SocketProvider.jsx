import { useQueryClient } from "@tanstack/react-query";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const queryClient = useQueryClient();
    // Prevent double connection in development (StrictMode)
    const socketRef = useRef(null);

    useEffect(() => {
        // Skip if we already have a socket reference (dev StrictMode protection)
        if (socketRef.current) return;

        const token = sessionStorage.getItem("token");

        // Optional: skip connection if no token
        if (!token) {
            console.warn("No token found in sessionStorage → socket not connecting");
            return;
        }
        console.log(import.meta.env.VITE_SOCKET_BASE_URL)
        const newSocket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
            auth: { accessToken: token },
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ["websocket"], // ← remove if you want polling fallback too
        });

        socketRef.current = newSocket;

        newSocket.on("connect", () => {
            // console.log("Socket connected →", newSocket.id);
            setConnected(true);
            setSocket(newSocket);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
            setConnected(false);
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected →", reason);
            setConnected(false);
        });

        // Optional: server can send custom auth error event
        newSocket.on("socket_error", (message) => {
            console.error("Auth failed:", message);
        });
        // const handleNewMessage = (message) => {
        //     const { roomId } = message;
        //     console.log(message)
        //     queryClient.setQueryData(["messages", roomId], (old = []) => {
        //         // prevent duplicates
        //         const exists = old.find((m) => m._id === message._id);
        //         if (exists) return old;

        //         return [...old, message];
        //     });
        // };

        // newSocket.on("new_message", handleNewMessage);


        return () => {
            console.log("Cleaning up socket...");
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);
            setConnected(false);
        };
    }, []);

    const handleSendMessage = useCallback(
        (payload, callback) => {
            if (!socket?.connected) {
                console.warn("Cannot send → socket is not connected");
                return;
            }
            queryClient.setQueryData(
                ["messages", payload.roomId],
                (old = []) => [...old, payload]  // optimistic message
            );
            socket.emit("send_message", payload, callback);
        },
        [socket]
    );

    const handleRejoinInRoom = useCallback(async (payload, callback) => {
        if (!socket?.connected) {
            console.warn("Cannot send → socket is not connected");
            return;
        }
        socket.emit("rejoin_room", payload, callback);
    }, [socket])

    const value = useMemo(
        () => ({
            socket,
            connected,
            handleSendMessage,
            handleRejoinInRoom,
        }),
        [socket, connected]
    );

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("useSocket must be used inside SocketProvider");
    }

    return context;
}