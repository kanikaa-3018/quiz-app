const SubjectCard = ({ icon, subject, topics, topicsCount, questionsCount, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
          isSelected ? 'transform scale-110' : 'transform hover:rotate-6'
        } ${
          subject === 'Physics' ? 'bg-blue-100 text-blue-500' : 
          subject === 'Chemistry' ? 'bg-green-100 text-green-500' : 
          'bg-purple-100 text-purple-500'
        }`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{subject}</h3>
        <p className="text-gray-600 text-sm mb-4">{topics}</p>
        
        <div className="text-xs text-gray-500">
          {topicsCount} topics • {questionsCount} questions
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;