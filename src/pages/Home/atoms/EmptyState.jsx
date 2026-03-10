import { C } from '../constants/design'
function EmptyState({ icon, title, sub }) {
    return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.textPrimary, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 13, color: C.textSecond, lineHeight: 1.5 }}>{sub}</div>
        </div>
    );
}

export default EmptyState;