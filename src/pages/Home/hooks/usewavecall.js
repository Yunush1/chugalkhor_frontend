import { useState, useRef, useCallback, useEffect } from "react";
import wavecall  from "wavecall-client";
import { useSocket } from "../../../services/socket/SocketProvider";
const WaveCallClient = wavecall.WaveCallSignaling || wavecall.default?.WaveCallSignaling;
/**
 * useWaveCall
 * Thin React wrapper around wavecall-client WaveCallClient.
 * Reuses the existing socket from SocketProvider — no extra connection.
 *
 * Usage:
 *   const call = useWaveCall();
 *   call.startCall(roomId, 'video');
 */
export function useWaveCall() {
    const { socket } = useSocket();

    // ── State ─────────────────────────────────────────────────────────────────
    const [inCall, setInCall] = useState(false);
    const [callId, setCallId] = useState(null);
    const [callType, setCallType] = useState("video");
    const [isInitiator, setIsInitiator] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});  // userId → MediaStream
    const [participants, setParticipants] = useState({});  // userId → { name, muted, handRaised }

    // ── WaveCallClient instance ref ───────────────────────────────────────────
    const clientRef = useRef(null);

    // ── Reset all call state ──────────────────────────────────────────────────
    const resetState = useCallback(() => {
        setInCall(false);
        setCallId(null);
        setIsInitiator(false);
        setIsMuted(false);
        setIsVideoOff(false);
        setIsHandRaised(false);
        setIsScreenSharing(false);
        setLocalStream(null);
        setRemoteStreams({});
        setParticipants({});
    }, []);

    // ── Create WaveCallClient and bind events once socket is ready ────────────
    useEffect(() => {
        if (!socket) return;

        const client = new WaveCallClient({ socket });
        clientRef.current = client;

        client
            // Your camera/mic stream is ready
            .on("local_stream", ({ stream }) => setLocalStream(stream))

            // Someone in your room started a call
            .on("incoming_call", (data) => setIncomingCall(data))

            // A peer's audio/video arrived — add their tile
            .on("participant_joined", ({ userId, name, stream }) => {
                setRemoteStreams(prev => ({ ...prev, [userId]: stream }));
                setParticipants(prev => ({
                    ...prev,
                    [userId]: { name, muted: false, handRaised: false },
                }));
            })

            // A peer disconnected — remove their tile
            .on("participant_left", ({ userId }) => {
                setRemoteStreams(prev => { const n = { ...prev }; delete n[userId]; return n; });
                setParticipants(prev => { const n = { ...prev }; delete n[userId]; return n; });
            })

            // Call ended for everyone (all left or host ended)
            .on("call_ended", resetState)

            // Host force-muted us
            .on("force_muted", () => setIsMuted(true))

            // Someone raised/lowered hand
            .on("hand_raised", ({ userId, isHandRaised: raised }) => {
                setParticipants(prev => prev[userId]
                    ? { ...prev, [userId]: { ...prev[userId], handRaised: raised } }
                    : prev
                );
            })

            // Host muted a participant
            .on("participant_muted", ({ userId }) => {
                setParticipants(prev => prev[userId]
                    ? { ...prev, [userId]: { ...prev[userId], muted: true } }
                    : prev
                );
            })

            // Our own mic/cam state changes (from toggleMute / toggleVideo)
            .on("mute_changed", ({ isMuted: m }) => setIsMuted(m))
            .on("video_changed", ({ isVideoOff: v }) => setIsVideoOff(v))
            .on("screen_share_started", () => setIsScreenSharing(true))
            .on("screen_share_stopped", () => setIsScreenSharing(false))

            .on("error", ({ message }) => console.error("[WaveCall]", message));

        return () => {
            client.leave();
            clientRef.current = null;
        };
    }, [socket, resetState]);

    // ── Token helper — get signed token from server via socket ────────────────
    const getToken = useCallback((roomId, type, existingCallId) => {
        return new Promise((resolve, reject) => {
            socket.emit(
                "wc:get_token",
                { roomId, callType: type, callId: existingCallId },
                (res) => res.success ? resolve(res.token) : reject(new Error(res.error))
            );
        });
    }, [socket]);

    // ── Public API ────────────────────────────────────────────────────────────

    /** Start a new call in a room */
    const startCall = useCallback(async (roomId, type = "video") => {
        const token = await getToken(roomId, type);
        await clientRef.current.initiate({ roomId, callType: type, token });
        setCallId(clientRef.current.callId);
        setCallType(type);
        setIsInitiator(true);
        setInCall(true);
    }, [getToken]);

    /** Accept an incoming call (user pressed Accept) */
    const acceptCall = useCallback(async () => {
        if (!incomingCall) return;
        const { callId: cId, callType: cType, roomId } = incomingCall;
        const token = await getToken(roomId, cType, cId);
        await clientRef.current.join({ callId: cId, token });
        setCallId(cId);
        setCallType(cType);
        setIsInitiator(false);
        setInCall(true);
        setIncomingCall(null);
    }, [incomingCall, getToken]);

    const declineCall = useCallback(() => setIncomingCall(null), []);

    const leaveCall = useCallback(() => {
        clientRef.current?.leave();
        resetState();
    }, [resetState]);

    const endCall = useCallback(() => {
        clientRef.current?.end();
        resetState();
    }, [resetState]);

    const toggleMute = useCallback(() => clientRef.current?.toggleMute(), []);
    const toggleVideo = useCallback(() => clientRef.current?.toggleVideo(), []);
    const toggleScreenShare = useCallback(() => clientRef.current?.toggleScreenShare(), []);
    const raiseHand = useCallback(() => clientRef.current?.raiseHand(), []);
    const muteParticipant = useCallback((uid) => clientRef.current?.muteParticipant(uid), []);

    return {
        // State
        inCall, callId, callType, isInitiator,
        isMuted, isVideoOff, isHandRaised, isScreenSharing,
        incomingCall, localStream, remoteStreams, participants,
        // Actions
        startCall, acceptCall, declineCall,
        leaveCall, endCall,
        toggleMute, toggleVideo, toggleScreenShare,
        raiseHand, muteParticipant,
    };
}