const QueueDetail = ({ queue, onClose }) => {
    if (!queue) {
        return null;
    }
    const getStatusColor = (status) => {
        const colors = {
            waiting: "#faad14",
            serving: "#1677ff",
            done: "#52c41a",
            cancelled: "#ff4d4f",
            skipped: "#999",
        };
        return colors[status] || "#999";
    };
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: "420px",
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "25px",
                    boxShadow:
                        "0 8px 20px rgba(0,0,0,0.15)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "22px",
                        }}
                    >
                        Queue Detail
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "#ff4d4f",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        X
                    </button>
                </div>
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "48px",
                            fontWeight: "700",
                            color: "#1677ff",
                        }}
                    >
                        {queue.number}
                    </div>
                    <span
                        style={{
                            display: "inline-block",
                            marginTop: "10px",
                            padding: "6px 15px",
                            borderRadius: "20px",
                            color: "#fff",
                            background:
                                getStatusColor(queue.status),
                            fontWeight: "600",
                            textTransform: "uppercase",
                        }}
                    >
                        {queue.status}
                    </span>
                </div>
                <div
                    style={{
                        lineHeight: "2",
                        color: "#555",
                    }}
                >
                    <p>
                        <b>Customer:</b>{" "}
                        {queue.userId?.fullName || "N/A"}
                    </p>
                    <p>
                        <b>Phone:</b>{" "}
                        {queue.userId?.phone || "-"}
                    </p>
                    <p>
                        <b>Service:</b>{" "}
                        {queue.serviceId?.name || "N/A"}
                    </p>
                    <p>
                        <b>Counter:</b>{" "}
                        {queue.counterId?.name || "-"}
                    </p>
                    <p>
                        <b>Staff:</b>{" "}
                        {queue.staffId?.fullName || "-"}
                    </p>
                    <p>
                        <b>Created:</b>{" "}
                        {new Date(
                            queue.createdAt
                        ).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QueueDetail;