const CounterCard = ({ counter }) => {
  if (!counter) {
    return (
      <div className="counter-card">
        <h3>Thông tin quầy</h3>
        <p>Chưa được phân công quầy.</p>
      </div>
    );
  }

  return (
    <div className="counter-card">
      <h3>Thông tin quầy</h3>

      <div className="counter-info">
        <p>
          <strong>Quầy:</strong> {counter.counterName}
        </p>

        <p>
          <strong>Trạng thái:</strong>{" "}
          {counter.status === "open" ? (
            <span className="status-open">🟢 Open</span>
          ) : (
            <span className="status-closed">🔴 Closed</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default CounterCard;