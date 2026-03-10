import { C } from "../constants/design";
function InfoCell({ label, val }) {
    return (
        <div>
            <div style={{ fontSize: 11.5, color: C.textSecond, marginBottom: 1 }}>{label}</div>
            <div style={{ fontSize: 14, color: C.textPrimary, fontWeight: 500 }}>{val}</div>
        </div>
    );
}

export default InfoCell;