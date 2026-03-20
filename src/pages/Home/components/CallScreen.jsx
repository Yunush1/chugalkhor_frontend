import { useEffect, useRef, useState } from "react";

/**
 * CallScreen
 * Full-screen call UI. Sits on top of the chat panel when a call is active.
 *
 * Props:
 *   call — return value of useWaveCall()
 */
export default function CallScreen({ call }) {
    const {
        callType, isInitiator, isMuted, isVideoOff, isHandRaised,
        isScreenSharing, localStream, remoteStreams, participants,
        toggleMute, toggleVideo, toggleScreenShare, raiseHand,
        leaveCall, endCall, muteParticipant,
    } = call;

    const [elapsed, setElapsed] = useState(0);
    const startRef = useRef(Date.now());

    // Timer
    useEffect(() => {
        startRef.current = Date.now();
        const t = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const fmt = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const remoteEntries = Object.entries(remoteStreams);
    const totalTiles = 1 + remoteEntries.length;

    const gridStyle = {
        ...styles.grid,
        gridTemplateColumns: totalTiles === 1
            ? "1fr"
            : totalTiles <= 4
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
    };

    return (
        <div style={styles.root}>
            {/* Top bar */}
            <div style={styles.topBar}>
                <div style={styles.liveDot} />
                <span style={styles.timer}>{fmt(elapsed)}</span>
                <span style={styles.typeBadge}>
                    {callType === "video" ? "VIDEO" : "AUDIO"}
                </span>
                <span style={{ flex: 1 }} />
                {/* Participants pills */}
                {Object.entries(participants).map(([uid, p]) => (
                    <div
                        key={uid}
                        style={{ ...styles.pill, ...(p.handRaised ? styles.pillHand : {}) }}
                    >
                        {p.handRaised ? "✋ " : ""}{p.name}{p.muted ? " 🔇" : ""}
                    </div>
                ))}
            </div>

            {/* Video grid */}
            <div style={gridStyle}>
                {/* Local tile */}
                <VideoTile
                    stream={localStream}
                    label="You"
                    muted
                    isMutedBadge={isMuted}
                    isVideoOff={isVideoOff}
                />

                {/* Remote tiles */}
                {remoteEntries.map(([userId, stream]) => (
                    <VideoTile
                        key={userId}
                        stream={stream}
                        label={participants[userId]?.name || "Guest"}
                        isMutedBadge={participants[userId]?.muted}
                        handRaised={participants[userId]?.handRaised}
                        onMute={isInitiator ? () => muteParticipant(userId) : undefined}
                    />
                ))}
            </div>

            {/* Controls */}
            <div style={styles.controls}>
                <CtrlBtn
                    active={isMuted}
                    onClick={toggleMute}
                    label={isMuted ? "Unmute" : "Mute"}
                    icon={isMuted ? "🔇" : "🎤"}
                />
                {callType === "video" && (
                    <CtrlBtn
                        active={isVideoOff}
                        onClick={toggleVideo}
                        label={isVideoOff ? "Cam on" : "Cam off"}
                        icon={isVideoOff ? "📷" : "📹"}
                    />
                )}
                <CtrlBtn
                    active={isScreenSharing}
                    onClick={toggleScreenShare}
                    label="Screen"
                    icon="🖥️"
                />
                <CtrlBtn
                    active={isHandRaised}
                    onClick={raiseHand}
                    label={isHandRaised ? "Lower" : "Hand"}
                    icon="✋"
                />
                <CtrlBtn
                    onClick={leaveCall}
                    label="Leave"
                    icon="🚪"
                    danger
                />
                {isInitiator && (
                    <CtrlBtn
                        onClick={endCall}
                        label="End all"
                        icon="📵"
                        danger
                    />
                )}
            </div>
        </div>
    );
}

// ── VideoTile ─────────────────────────────────────────────────────────────────

function VideoTile({ stream, label, muted = false, isMutedBadge, isVideoOff, handRaised, onMute }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div style={styles.tile}>
            {!isVideoOff && stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={muted}
                    style={styles.tileVideo}
                />
            ) : (
                <div style={styles.tileBlank}>
                    <div style={styles.tileAvatar}>
                        {label?.charAt(0)?.toUpperCase()}
                    </div>
                </div>
            )}

            <div style={styles.tileLabel}>{label}</div>

            {isMutedBadge && (
                <div style={styles.mutedBadge} title="Muted">🔇</div>
            )}
            {handRaised && (
                <div style={styles.handBadge}>✋</div>
            )}
            {onMute && (
                <button style={styles.muteBtnHost} onClick={onMute} title="Mute participant">
                    🔇
                </button>
            )}
        </div>
    );
}

// ── CtrlBtn ───────────────────────────────────────────────────────────────────

function CtrlBtn({ onClick, label, icon, active, danger }) {
    return (
        <button
            onClick={onClick}
            style={{
                ...styles.ctrlBtn,
                ...(active ? styles.ctrlBtnActive : {}),
                ...(danger ? styles.ctrlBtnDanger : {}),
            }}
        >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={styles.ctrlLabel}>{label}</span>
        </button>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
    root: {
        position: "absolute",
        inset: 0,
        background: "#050508",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    topBar: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "#0a0a10",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap",
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#22c55e",
        animation: "blink 1.4s ease-in-out infinite",
        flexShrink: 0,
    },
    timer: {
        fontFamily: "monospace",
        fontSize: 14,
        color: "#e8e8f0",
        fontWeight: 500,
    },
    typeBadge: {
        fontSize: 11,
        fontWeight: 600,
        color: "#6c63ff",
        background: "rgba(108,99,255,0.12)",
        padding: "2px 8px",
        borderRadius: 20,
        letterSpacing: "0.06em",
    },
    pill: {
        fontSize: 12,
        color: "#6b6b80",
        background: "#1a1a24",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "2px 10px",
    },
    pillHand: {
        borderColor: "#f59e0b",
        color: "#f59e0b",
    },
    grid: {
        flex: 1,
        display: "grid",
        gap: 8,
        padding: 10,
        minHeight: 0,
        overflow: "hidden",
    },
    tile: {
        position: "relative",
        background: "#111118",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
    },
    tileVideo: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    },
    tileBlank: {
        width: "100%",
        height: "100%",
        minHeight: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d14",
    },
    tileAvatar: {
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6c63ff, #4facfe)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 600,
        color: "#fff",
    },
    tileLabel: {
        position: "absolute",
        bottom: 10,
        left: 12,
        fontSize: 12,
        fontWeight: 500,
        background: "rgba(0,0,0,0.6)",
        padding: "3px 10px",
        borderRadius: 20,
        color: "#e8e8f0",
        backdropFilter: "blur(6px)",
    },
    mutedBadge: {
        position: "absolute",
        top: 10,
        left: 12,
        fontSize: 14,
    },
    handBadge: {
        position: "absolute",
        top: 10,
        right: 12,
        fontSize: 18,
    },
    muteBtnHost: {
        position: "absolute",
        bottom: 10,
        right: 10,
        background: "rgba(0,0,0,0.55)",
        border: "none",
        borderRadius: "50%",
        width: 32,
        height: 32,
        cursor: "pointer",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    controls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "14px 20px",
        background: "#0a0a10",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap",
    },
    ctrlBtn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        background: "#1a1a24",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "10px 16px",
        color: "#e8e8f0",
        cursor: "pointer",
        minWidth: 64,
        fontFamily: "inherit",
        transition: "all 0.15s",
    },
    ctrlBtnActive: {
        background: "rgba(108,99,255,0.15)",
        borderColor: "#6c63ff",
        color: "#6c63ff",
    },
    ctrlBtnDanger: {
        background: "rgba(239,68,68,0.12)",
        borderColor: "#ef4444",
        color: "#ef4444",
    },
    ctrlLabel: {
        fontSize: 11,
        fontWeight: 500,
    },
};