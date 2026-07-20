const QueueTable = ({ queues, loading, onSelect }) => {
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

    if (loading) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "30px",
                    fontSize: "16px",
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                overflowX: "auto",
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr>
                        {[
                            "Queue",
                            "Customer",
                            "Service",
                            "Counter",
                            "Staff",
                            "Status",
                            "Created At",
                        ].map((title) => (
                            <th
                                key={title}
                                style={{
                                    padding: "14px",
                                    background: "#f5f5f5",
                                    borderBottom: "1px solid #ddd",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    color: "#333",
                                }}
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {queues.map((record) => (
                        <tr key={record._id} onClick={() => onSelect(record)} style={{cursor: "pointer"}}>
                            <td
                                style={{
                                    padding: "14px",
                                    textAlign: "center",
                                    borderBottom: "1px solid #eee",
                                    fontWeight: "700",
                                }}
                            >
                                {record.number}
                            </td>

                            <td
                                style={{
                                    padding: "14px",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                {record.userId?.fullName || "N/A"}
                            </td>

                            <td
                                style={{
                                    padding: "14px",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                {record.serviceId?.name || "N/A"}
                            </td>

                            <td
                                style={{
                                    padding: "14px",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                {record.counterId?.counterName || "-"}
                            </td>

                            <td
                                style={{
                                    padding: "14px",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                {record.staffId?.fullName || "-"}
                            </td>

                            <td
                                style={{
                                    padding: "14px",
                                    borderBottom: "1px solid #eee",
                                    textAlign: "center",
                                }}
                            >
                                <span
                                    style={{
                                        background:
                                            getStatusColor(record.status),
                                        color: "#fff",
                                        padding: "5px 12px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {record.status}
                                </span>
                            </td>

                            <td
                                style={{
                                    padding: "14px",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                {new Date(
                                    record.createdAt
                                ).toLocaleString()}
                            </td>
                        </tr>
                    ))}

                    {queues.length === 0 && (
                        <tr>
                            <td
                                colSpan="7"
                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "#999",
                                }}
                            >
                                No queue data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default QueueTable;