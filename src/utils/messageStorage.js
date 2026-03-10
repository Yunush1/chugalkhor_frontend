// utils/messageStorage.js

export const getStoredMessages = (roomId) => {
    try {
        const data = localStorage.getItem(`messages_${roomId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveMessages = (roomId, messages) => {
    try {
        localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
    } catch (e) {
        console.error("Failed to save messages", e);
    }
};