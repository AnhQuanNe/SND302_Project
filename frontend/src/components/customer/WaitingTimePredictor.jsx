const WaitingTimePredictor = ({ time }) => {
  if (!time) return null;

  return (
    <div className="mt-4 text-center">
      ⏳ Estimated waiting time: <b>{time} minutes</b>
    </div>
  );
};

export default WaitingTimePredictor;