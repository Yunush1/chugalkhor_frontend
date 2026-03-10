import { C } from '../constants/design'
function SkeletonRow() {
    return (
        <div style={{ display: "flex", alignItems: "center", padding: "13px 16px", gap: 12, borderBottom: `1px solid ${C.divider}` }}>
            <div className="wa-pulse" style={{ width: 49, height: 49, borderRadius: "50%", backgroundColor: C.skeleton, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <div className="wa-pulse" style={{ height: 14, backgroundColor: C.skeleton, borderRadius: 4, marginBottom: 8, width: "55%" }} />
                <div className="wa-pulse" style={{ height: 12, backgroundColor: C.skeleton, borderRadius: 4, width: "80%" }} />
            </div>
        </div>
    );
}

export default SkeletonRow;