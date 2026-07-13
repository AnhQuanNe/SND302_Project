const CurrentQueue = ({ queue }) => {
  // Chưa có khách đang phục vụ
  if (!queue) {
    return (
      <div className="current-queue-card">
        <h3>Đang phục vụ</h3>
        <p>Hiện tại chưa có khách đang phục vụ.</p>
      </div>
    );
  }

  return (
    <div className="current-queue-card">
      <h3>Đang phục vụ</h3>

      <div className="queue-info">
        <p>
          <strong>Số thứ tự:</strong> {queue.number}
        </p>

        <p>
          <strong>Khách hàng:</strong> {queue.userId?.fullName}
        </p>

        <p>
          <strong>Email:</strong> {queue.userId?.email}
        </p>

        <p>
          <strong>Dịch vụ:</strong> {queue.serviceId?.name}
        </p>

        <p>
          <strong>Trạng thái:</strong>{" "}
          {queue.status === "serving" && (
            <span className="status-serving">🟢 Đang phục vụ</span>
          )}

          {queue.status === "waiting" && (
            <span className="status-waiting">🟡 Đang chờ</span>
          )}

          {queue.status === "skipped" && (
            <span className="status-skipped">🟠 Đã bỏ qua</span>
          )}

          {queue.status === "done" && (
            <span className="status-done">✅ Hoàn thành</span>
          )}

          {queue.status === "cancelled" && (
            <span className="status-cancelled">❌ Đã hủy</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default CurrentQueue;