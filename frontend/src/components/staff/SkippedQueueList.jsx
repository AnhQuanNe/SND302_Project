import {
  recallQueue,
} from "../../services/staff.service";

const SkippedQueueList = ({ queues, reload }) => {

  const handleRecall = async (queueId) => {
    try {
      await recallQueue(queueId);

      alert("Đã gọi lại khách thành công.");

      reload();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Không thể gọi lại khách."
      );
    }
  };

  return (
    <div className="staff-card">

      <h3>Skipped Queue List</h3>

      {!queues || queues.length === 0 ? (
        <p>Không có khách nào bị Skip.</p>
      ) : (
        <table className="staff-table">
          <thead>
            <tr>
              <th>Queue</th>
              <th>Customer</th>
              <th>Service</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {queues.map((queue) => (
              <tr key={queue._id}>

                <td>
                  #{queue.number}
                </td>

                <td>
                  {queue.userId?.fullName}
                </td>

                <td>
                  {queue.serviceId?.name}
                </td>

                <td>
                  <button
                    className="btn-primary"
                    onClick={() => handleRecall(queue._id)}
                  >
                    Recall
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default SkippedQueueList;