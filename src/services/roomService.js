import api from "./api";

const getNearbyRooms = async ({ lat, lng }) => {
    try {
        const res = await api.get('/rooms', {
            params: {
                latitude: lat,
                longitude: lng
            }
        })
        return res;
    } catch (error) {
        throw error.response
    }
}

const joinInAndLeaveRooms = async ({ roomId, type }) => {
    try {
        const res = await api.post(`rooms/${roomId}/${type}`)
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

const createRooms = async (data) => {
    try {
        const res = await api.post(`rooms`, data);
        return res.data;
    } catch (error) {
        throw error?.response
    }
}

const getAllUsersByRoom = async ({ roomId }) => {
    try {
        const res = await api.get('rooms/users', {
            params: {
                roomId
            }
        })
        return res.data
    } catch (error) {
        throw error.response
    }
}

const removeUserFromRoom = async ({ roomId, targetId }) => {
    try {

        const res = await api.post('rooms/users', {
            roomId, targetId
        })
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export { getNearbyRooms, joinInAndLeaveRooms, createRooms, getAllUsersByRoom, removeUserFromRoom }