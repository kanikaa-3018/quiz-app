const ClassButton = ({ number, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center border rounded-lg py-4 cursor-pointer transition-all duration-300 transform hover:shadow-md ${
        isSelected 
          ? 'bg-blue-500 text-white border-blue-600' 
          : 'border-gray-200 hover:border-blue-300 hover:-translate-y-1'
      }`}
    >
      <div className="text-2xl font-bold mb-1">{number}</div>
      <div className="text-sm">Class {number}</div>
    </div>
  );
};

export default ClassButton;