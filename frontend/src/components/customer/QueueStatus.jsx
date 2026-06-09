function QueueStatus({ queue }) {
  return (
    <div className="bg-white shadow p-5 rounded">
      <h2>Your Queue Number</h2>

      <div className="text-5xl font-bold text-blue-600">
        {queue.number}
      </div>

      <p>Status: {queue.status}</p>

      <p>
        Estimated Wait:
        {queue.estimatedTime} minutes
      </p>
    </div>
  );
}

export default QueueStatus;