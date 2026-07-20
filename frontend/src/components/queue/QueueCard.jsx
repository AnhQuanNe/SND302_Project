import { Card, Col, Row } from "antd";

const QueueCard = ({ statistics }) => {
    const data = [
        {
            title: "Waiting",
            value: statistics.waiting || 0,
            color: "#faad14",
        },
        {
            title: "Serving",
            value: statistics.serving || 0,
            color: "#1890ff",
        },
        {
            title: "Done",
            value: statistics.done || 0,
            color: "#52c41a",
        },
        {
            title: "Cancelled",
            value: statistics.cancelled || 0,
            color: "#ff4d4f",
        },
        {
            title: "Skipped",
            value: statistics.skipped || 0,
            color: "#8c8c8c",
        },
    ];

    return (
        <Row gutter={16} style={{ marginBottom: 24 }}>
            {data.map((item) => (
                <Col span={4} key={item.title}>
                    <Card bordered={false}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, color: "#666" }}>
                                {item.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 32,
                                    fontWeight: 700,
                                    color: item.color,
                                }}
                            >
                                {item.value}
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default QueueCard;