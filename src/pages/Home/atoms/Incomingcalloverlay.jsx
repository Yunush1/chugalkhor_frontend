import { useEffect, useRef } from "react";

/**
 * IncomingCallOverlay
 * Shows when someone calls you. Accepts or declines.
 */
export default function IncomingCallOverlay({ incomingCall, onAccept, onDecline }) {
    if (!incomingCall) return null;

    const { initiator, callType } = incomingCall;

    return (
        <div style={styles.backdrop}>
            <div style={styles.card}>
                <div style={styles.avatarWrap}>
                    <div style={styles.avatar}>
                        {initiator?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={styles.ripple1} />
                    <div style={styles.ripple2} />
                </div>

                <p style={styles.callerName}>{initiator?.name || "Someone"}</p>
                <p style={styles.callTypeLabel}>
                    {callType === "video" ? "📹 Video call" : "🎤 Audio call"}
                </p>

                <div style={styles.btnRow}>
                    <button style={styles.btnDecline} onClick={onDecline}>
                        <span style={styles.btnIcon}>✕</span>
                        Decline
                    </button>
                    <button style={styles.btnAccept} onClick={onAccept}>
                        <span style={styles.btnIcon}>✓</span>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    backdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "40px 36px",
        textAlign: "center",
        width: 320,
    },
    avatarWrap: {
        position: "relative",
        width: 80,
        height: 80,
        margin: "0 auto 20px",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6c63ff, #4facfe)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
        fontWeight: 600,
        color: "#fff",
        position: "relative",
        zIndex: 1,
        animation: "callPulse 1.5s ease-in-out infinite",
    },
    ripple1: {
        position: "absolute",
        inset: -10,
        borderRadius: "50%",
        border: "2px solid rgba(108,99,255,0.4)",
        animation: "ripple 1.5s ease-out infinite",
    },
    ripple2: {
        position: "absolute",
        inset: -20,
        borderRadius: "50%",
        border: "2px solid rgba(108,99,255,0.2)",
        animation: "ripple 1.5s ease-out infinite 0.4s",
    },
    callerName: {
        fontSize: 20,
        fontWeight: 600,
        color: "#e8e8f0",
        margin: "0 0 8px",
    },
    callTypeLabel: {
        fontSize: 14,
        color: "#6b6b80",
        margin: "0 0 32px",
    },
    btnRow: {
        display: "flex",
        gap: 12,
    },
    btnDecline: {
        flex: 1,
        padding: "13px 0",
        background: "rgba(239,68,68,0.15)",
        border: "1px solid #ef4444",
        borderRadius: 12,
        color: "#ef4444",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "inherit",
    },
    btnAccept: {
        flex: 1,
        padding: "13px 0",
        background: "#22c55e",
        border: "none",
        borderRadius: 12,
        color: "#fff",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "inherit",
    },
    btnIcon: {
        fontSize: 16,
        fontWeight: 700,
    },
};