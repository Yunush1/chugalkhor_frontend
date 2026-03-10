// hooks/useNearbyRooms.js
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRooms, getAllUsersByRoom, getNearbyRooms, joinInAndLeaveRooms, removeUserFromRoom } from "../roomService";   // ← your API service
import { queryClient } from "../store/queryClient";
import { message } from "antd";

/**
 * Fetches nearby rooms based on user's current coordinates
 * @param {Object|null} location - { lat: number, lng: number } or null
 * @returns {Object} React Query result object
 */
export const useNearbyRooms = (location) => {
    return useQuery({
        queryKey: ["nearby-rooms", location?.lat, location?.lng],

        // The actual fetch function
        queryFn: async () => {
            if (!location?.lat || !location?.lng) {
                throw new Error("Location coordinates are missing");
            }

            const response = await getNearbyRooms(location);
            return response?.data?.rooms ?? response?.rooms ?? response ?? [];
        },

        // Only run the query when we actually have coordinates
        enabled: !!location?.lat && !!location?.lng,

        // Recommended settings for this kind of query
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

        // Optional: transform error messages to be more user-friendly
        throwOnError: false,
    });
};

export const useJoinInAndLeaveRooms = () => {
    return useMutation({
        mutationKey: ['join-rooms'],
        mutationFn: joinInAndLeaveRooms,
    });
};

export const useCreateRoom = () => {
    return useMutation({
        mutationKey: ['create-rooms'],
        mutationFn: createRooms,
        onSuccess: (newRoom, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["nearby-rooms"],
            });
        }
    })
}

export const useUsersPerRoom = (roomId) => {
    return useQuery({
        queryKey: ['users-rooms', roomId],
        enabled: !!roomId,
        queryFn: ({ queryKey }) => {
            const [, id] = queryKey;
            return getAllUsersByRoom({ roomId: id });
        },
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        retry: 1,
    })
}

export const useRemoveUserFromRoom = () => {
    return useMutation({
        mutationKey: ['remove-users-from-room'],
        mutationFn: removeUserFromRoom,
        onSuccess: (newRoom, variables, context) => {
            message.success('Chugalakhor removed successfully')
            queryClient.invalidateQueries({
                queryKey: ["users-rooms"],
            });
        }
    })
}