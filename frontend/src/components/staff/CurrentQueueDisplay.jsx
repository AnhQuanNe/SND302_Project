function CurrentQueueDisplay() {
  return (
    <div className="bg-white p-5 shadow rounded">
      <h2 className="text-2xl font-bold">
        Current Queue
      </h2>

      <div className="text-6xl text-green-600 mt-4">
        A001
      </div>

      <button className="bg-blue-500 text-white px-5 py-2 rounded mt-4">
        Next Queue
      </button>
    </div>
  );
}

export default CurrentQueueDisplay;