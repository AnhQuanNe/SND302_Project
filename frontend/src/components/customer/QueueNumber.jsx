const QueueNumber = ({ queue }) => {
  if (!queue) return null;

  return (
    <div className="mt-6 text-center">
      <h2 className="text-xl">Your Queue Number</h2>
      <div className="text-5xl font-bold text-green-600">
        {queue.queueNumber}
      </div>
    </div>
  );
};

export default QueueNumber;