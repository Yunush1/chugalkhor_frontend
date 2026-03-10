import { C } from "../constants/design";
function Globals() {
  return (
    <style>{`
      *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; width: 100%; overflow: hidden; }
      body { font-family: 'Segoe UI', Helvetica Neue, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
      input, button { font-family: inherit; }
      @keyframes wa-spin { to { transform: rotate(360deg); } }
      @keyframes wa-pulse { 0%,100% { opacity:1; } 50% { opacity:.45; } }
      .wa-pulse { animation: wa-pulse 1.5s ease-in-out infinite; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #C1CBCD; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #A0ADB0; }
    `}</style>
  );
}

export const WA_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b2bec3' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export const S = {
  root: {
    height: "100vh", width: "100vw",
    display: "flex", flexDirection: "column",
    backgroundColor: "#128C7E",   // teal strip visible behind the card on desktop
    overflow: "hidden",
  },

  // Desktop: full-bleed two-panel
  desktopWrap: {
    flex: 1, display: "flex",
    width: "100%", height: "100%",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,.25)",
  },

  // ── Side panel ──
  side: {
    width: 420,
    minWidth: 300,
    display: "flex", flexDirection: "column",
    backgroundColor: C.white,
    borderRight: `1px solid ${C.divider}`,
    overflow: "hidden",
    flexShrink: 0,
  },
  sideMobile: {
    width: "100%",
    borderRight: "none",
  },
  sideHeader: {
    display: "flex", alignItems: "center",
    padding: "10px 16px", backgroundColor: C.bg,
    minHeight: 59, gap: 12, flexShrink: 0,
  },
  sideAvatar: {
    width: 40, height: 40, borderRadius: "50%",
    backgroundColor: '#fff7d2',
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  sideTitle: {
    flex: 1, fontSize: 20, fontWeight: 600,
    color: C.textPrimary, letterSpacing: "-0.3px",
  },
  searchBox: {
    display: "flex", alignItems: "center",
    backgroundColor: C.searchBg, borderRadius: 8,
    padding: "7px 12px", gap: 10,
  },
  searchInput: {
    border: "none", background: "transparent", outline: "none",
    fontSize: 15, color: C.textPrimary, flex: 1,
  },
  clearBtn: {
    border: "none", background: "transparent",
    cursor: "pointer", color: C.textSecond, fontSize: 14,
    display: "flex", alignItems: "center",
  },
  roomList: { flex: 1, overflowY: "auto" },

  // ── Room row ──
  roomRow: {
    display: "flex", alignItems: "center",
    padding: "13px 16px", cursor: "pointer",
    borderBottom: `1px solid ${C.divider}`,
    gap: 12, transition: "background-color .1s ease",
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 },
  rowName: { fontSize: 17, color: C.textPrimary, fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 },
  rowTime: { fontSize: 12, color: C.textSecond, flexShrink: 0 },
  rowBot: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rowDesc: { fontSize: 14, color: C.textSecond, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 6 },
  badge: { color: "#fff", borderRadius: 10, padding: "2px 7px", fontSize: 12, fontWeight: 700, textAlign: "center", minWidth: 20, flexShrink: 0 },

  // ── Chat area ──
  chatArea: {
    flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
    backgroundColor: C.chatWall, backgroundImage: WA_BG,
  },
  chatPanel: {
    flex: 1, display: "flex", flexDirection: "column",
    overflow: "hidden", height: "100%",
    backgroundColor: C.chatWall, backgroundImage: WA_BG,
  },
  chatHeader: {
    display: "flex", alignItems: "center", padding: "0 10px 0 8px",
    gap: 8, backgroundColor: C.bg,
    minHeight: 59, flexShrink: 0, borderBottom: `1px solid ${C.divider}`,
  },
  backBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 8, display: "flex", alignItems: "center",
    borderRadius: "50%", flexShrink: 0,
  },
  chatName: { fontSize: 17, fontWeight: 500, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  chatSub: { fontSize: 13, color: C.textSecond },

  // ── Messages ──
  messages: {
    flex: 1, overflowY: "auto",
    padding: "16px 5% 10px",
    display: "flex", flexDirection: "column", gap: 4,
  },
  bubble: {
    backgroundColor: C.white, borderRadius: 8,
    padding: "10px 14px 8px",
    maxWidth: "min(420px, 90%)",
    boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
    position: "relative",
  },
  bubbleTail: {
    position: "absolute", top: 0, left: -8,
    width: 0, height: 0, borderStyle: "solid",
    borderWidth: "0 8px 8px 0",
    borderColor: `transparent ${C.white} transparent transparent`,
  },
  bubbleText: { fontSize: 14.5, color: C.textPrimary, lineHeight: 1.55, marginBottom: 8 },

  // ── Bottom bar ──
  bottomBar: {
    backgroundColor: C.bg, padding: "10px 16px", flexShrink: 0,
    borderTop: `1px solid ${C.divider}`,
  },
  joinedRow: {
    display: "flex", alignItems: "center", gap: 8,
    backgroundColor: C.white, borderRadius: 24, padding: "11px 16px",
  },
  joinBtn: {
    width: "100%", border: "none", borderRadius: 24,
    padding: "12px 20px", fontSize: 15, fontWeight: 600,
    color: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "background-color .15s ease",
  },

  // ── Welcome ──
  welcome: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 14, padding: 32,
  },
  welcomeCircle: {
    width: 200, height: 200, borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 72, marginBottom: 8,
  },

  // ── Location ──
  locScreen: {
    height: "100vh", width: "100vw",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    backgroundColor: C.bg,
  },
  spinner: {
    width: 44, height: 44,
    border: `3px solid ${C.greenLight}`,
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "wa-spin .8s linear infinite",
  },

  // Add these to your S object
  inputContainer: {
    backgroundColor: C.bg,
    padding: "10px 12px",
    borderTop: `1px solid ${C.divider}`,
    flexShrink: 0,
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 24,
    padding: "6px 12px",
    gap: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },

  messageInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    color: C.textPrimary,
    padding: "8px 0",
    minHeight: 38,
    resize: "none",
  },

  
};
export default Globals;