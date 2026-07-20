import { useEffect, useState } from "react";

import QueueTable from "../../components/queue/QueueTable";
import QueueFilter from "../../components/queue/QueueFilter";
import QueueDetail from "../../components/queue/QueueDetail";

import { getAllQueues, getQueueDetail } from "../../services/queue.service";

const QueueManagement = () => {
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQueue, setSelectedQueue] = useState(null);
    const [filter, setFilter] = useState({});

    const fetchQueues = async () => {
        try {
            setLoading(true);
            const res = await getAllQueues(filter);
            console.log("QUEUE RESPONSE:", res.data);
            setQueues(
                res.data.data || []
            );
        } catch (error) {
            console.log(
                "Get queues error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchQueues();
    }, [filter]);
    const handleFilter = (value) => {
        setFilter(prev => ({
            ...prev,
            ...value
        }));
    };

    const handleSelectQueue = async (queue) => {
        try {
            const res = await getQueueDetail(queue._id);

            setSelectedQueue(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <div
            style={{
                padding: "25px",
                background: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            <h1
                style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    marginBottom: "20px",
                }}
            >
                Queue Management
            </h1>
            <QueueFilter
                onFilter={handleFilter}
            />
            <QueueTable
                queues={queues}
                loading={loading}
                onSelect={handleSelectQueue}
            />
            <QueueDetail
                queue={selectedQueue}
                onClose={() =>
                    setSelectedQueue(null)
                }
            />
        </div>
    );
};

export default QueueManagement;