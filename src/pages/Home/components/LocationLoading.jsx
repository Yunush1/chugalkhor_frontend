import { C } from "../constants/design";
import Globals, { S } from "../style/Globals"; // or however you handle global styles
export default function LocationLoading() {
    return (
        <div style={S.locScreen}>
            <Globals />
            <div style={S.spinner} />
            <p style={{ color: C.textSecond, fontSize: 15, marginTop: 16 }}>
                Getting your location…
            </p>
        </div>
    );
}