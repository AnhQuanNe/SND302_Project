import { useEffect, useState } from "react";
import socket from "../../services/socket.service";

function QueueBoard() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    socket.on("queueUpdated", (data) => {
      setQueues(data);
    });

    return () => {
      socket.off("queueUpdated");
    };
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {queues.map((q) => (
        <div
          key={q.id}
          className="bg-white p-4 rounded shadow"
        >
          {q.number}
        </div>
      ))}
    </div>
  );
}

export default QueueBoard;