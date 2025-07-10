const StatCard = ({ icon, value, label, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;