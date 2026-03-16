import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../socket/SocketProvider";

/**
 * Messages cache per room
 */
export const useNewMessages = (roomId) => {
    const queryClient = useQueryClient();
    const { socket } = useSocket();

    const query = useQuery({
        queryKey: ["messages", roomId],
        queryFn: () => [],
        enabled: !!roomId,
        initialData: [],
        staleTime: Infinity,
    });

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (payload) => {
            if (!payload?.message) return;

            const message = payload.message;

            if (!message?.roomId || !message?._id) return;

            queryClient.setQueryData(["messages", message.roomId], (old = []) => {
                const safeOld = Array.isArray(old) ? old : [];

                const exists = safeOld.find((m) => m?._id === message._id);

                if (exists) return safeOld;

                return [...safeOld, message];
            });
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, queryClient]);

    return query;
};


/**
 * Send message via socket
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();
    const { socket } = useSocket();

    return useMutation({
        mutationKey: ["send-message"],

        mutationFn: async (payload) => {
            return new Promise((resolve, reject) => {
                if (!socket?.connected) {
                    reject("Socket not connected");
                    return;
                }

                socket.emit("send_message", payload, (response) => {
                    if (response?.success) resolve(response);
                    else reject(response);
                });
            });
        },

        /**
         * Optimistic update
         */
        onMutate: async (payload) => {
            const { roomId } = payload;

            queryClient.setQueryData(["messages", roomId], (old = []) => [
                ...old,
                {
                    ...payload,
                    _id: Date.now(),
                    pending: true,
                },
            ]);
        },

        /**
         * Replace optimistic message with server message
         */
        onSuccess: (response, payload) => {
            const { roomId } = payload;
            const serverMessage = response?.message;

            if (!serverMessage) return;

            queryClient.setQueryData(["messages", roomId], (old = []) =>
                old.map((msg) =>
                    msg.pending ? serverMessage : msg
                )
            );
        },
    });
};


export const useNewUserJoined = () => {
    const queryClient = useQueryClient();
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleUserJoined = (payload) => {
            const { roomId, userId, username, joinedAt } = payload;
            console.log("cdscsd", payload)
            // Normalise into the shape your UI already expects for a member
            const newMember = {
                _id: userId,
                username: username ?? null,
                name: username ?? null,
                joinedAt,
            };

            // 1️⃣  Update the single-room cache ["room", roomId]
            queryClient.setQueryData(["room", roomId], (old) => {
                if (!old) return old;

                const alreadyMember = old.members?.some(
                    (m) => m._id === userId
                );
                if (alreadyMember) return old;

                return {
                    ...old,
                    members: [...(old.members ?? []), newMember],
                    memberCount: (old.memberCount ?? old.members?.length ?? 0) + 1,
                };
            });

            // 2️⃣  Update the member list cache ["room-members", roomId] if you use one
            queryClient.setQueryData(["room-members", roomId], (old) => {
                if (!old) return old;

                // Support both array and { users: [] } shapes
                if (Array.isArray(old)) {
                    const exists = old.some((m) => m._id === userId);
                    return exists ? old : [...old, newMember];
                }

                if (old.users) {
                    const exists = old.users.some((m) => m._id === userId);
                    return exists
                        ? old
                        : {
                            ...old,
                            users: [...old.users, newMember],
                            count: (old.count ?? old.users.length) + 1,
                        };
                }

                return old;
            });

            // 3️⃣  Invalidate nearby-rooms so member counts stay fresh
            queryClient.invalidateQueries({ queryKey: ["nearby-rooms"] });
        };

        socket.on("user_joined", handleUserJoined);

        return () => {
            socket.off("user_joined", handleUserJoined);
        };
    }, [socket, queryClient]);
};