import {
  callNextQueue,
  completeQueue,
  skipQueue,
  updateCounterStatus,
} from "../../services/staff.service";

const StaffActions = ({ queue, counter, reload }) => {
  // =============================
  // Call Next
  // =============================
  const handleCallNext = async () => {
    try {
      await callNextQueue();
      alert("Gọi khách tiếp theo thành công.");
      reload();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  // =============================
  // Complete
  // =============================
  const handleComplete = async () => {
    if (!queue) return;

    try {
      await completeQueue(queue._id);
      alert("Hoàn thành phục vụ.");
      reload();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  // =============================
  // Skip
  // =============================
  const handleSkip = async () => {
    if (!queue) return;

    try {
      await skipQueue(queue._id);
      alert("Đã bỏ qua khách.");
      reload();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  // =============================
  // Open / Close Counter
  // =============================
  const handleToggleCounter = async () => {
    if (!counter) return;

    const newStatus =
      counter.status === "open" ? "closed" : "open";

    try {
      await updateCounterStatus(newStatus);
      alert("Cập nhật trạng thái quầy thành công.");
      reload();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div className="staff-actions">

      <h3>Thao tác</h3>

      <button
        className="call-btn"
        onClick={handleCallNext}
        disabled={!!queue}
      >
        Call Next
      </button>

      <button
        className="complete-btn"
        onClick={handleComplete}
        disabled={!queue || queue.status !== "serving"}
      >
        Complete
      </button>

      <button
        className="skip-btn"
        onClick={handleSkip}
        disabled={!queue || queue.status !== "serving"}
      >
        Skip
      </button>

      <button
        className="toggle-counter-btn"
        onClick={handleToggleCounter}
        disabled={!counter}
      >
        {counter?.status === "open"
          ? "Close Counter"
          : "Open Counter"}
      </button>

    </div>
  );
};

export default StaffActions;