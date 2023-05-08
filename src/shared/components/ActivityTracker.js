const ActivityTracker = ({ activityStep }) => {
  return (
    <div className="flex" style={{ gap: "20px" }}>
      <div
        style={{ height: 10 }}
        className={`w-full rounded-xl w-4/12 px-2 bg-primary`}
      ></div>
      <div
        style={{ height: 10 }}
        className={`w-full rounded-xl w-4/12 px-2 ${
          activityStep > 1 ? "bg-primary" : "bg-gray-300"
        }`}
      ></div>
      <div
        style={{ height: 10 }}
        className={`w-full rounded-xl w-4/12 px-2 ${
          activityStep > 2 ? "bg-primary" : "bg-gray-300"
        }`}
      ></div>
    </div>
  );
};

export default ActivityTracker;
