function Chip({ children }) {
    return (
        <div style={{ textAlign: "center", margin: "6px 0" }}>
            <span style={{
                display: "inline-block", backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 8,
                padding: "5px 12px", fontSize: 12.5, color: "#54656F", boxShadow: "0 1px 0.5px rgba(11,20,26,.13)"
            }}>
                {children}
            </span>
        </div>
    );
}

export default Chip;