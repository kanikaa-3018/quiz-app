import { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import ClassButton from '../components/ClassButton';
import SubjectCard from '../components/SubjectCard';

const TakeQuiz = () => {
  const [selectedClass, setSelectedClass] = useState('12');
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  const classes = ['5', '6', '7', '8', '9', '10', '11', '12'];
  
  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      topics: 'Mechanics, Thermodynamics, Optics',
      topicsCount: '15',
      questionsCount: '120',
      icon: <i className="fas fa-atom text-xl"></i>
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      topics: 'Organic, Inorganic, Physical',
      topicsCount: '15',
      questionsCount: '120',
      icon: <i className="fas fa-flask text-xl"></i>
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      topics: 'Calculus, Algebra, Geometry',
      topicsCount: '15',
      questionsCount: '120',
      icon: <i className="fas fa-square-root-alt text-xl"></i>
    }
  ];
  
  const handleStartQuiz = () => {
    // In a real app, this would navigate to the actual quiz
    console.log(`Starting quiz for Class ${selectedClass}, Subject: ${selectedSubject}`);
    // For now we'll just show an alert
    alert(`Quiz starting for Class ${selectedClass}, Subject: ${selectedSubject}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 animate-fade-in">Choose Your Quiz</h1>
          <p className="text-gray-600 animate-fade-in-delay">Select your class and subject to begin</p>
        </div>
        
        {/* Class Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4">Select Class</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classes.map((classNum) => (
              <ClassButton
                key={classNum}
                number={classNum}
                isSelected={selectedClass === classNum}
                onClick={() => setSelectedClass(classNum)}
              />
            ))}
          </div>
        </div>
        
        {/* Subject Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-semibold mb-4">Select Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <div 
                key={subject.id}
                className="animate-subject-appear"
                style={{ 
                  animationDelay: `${index * 0.15 + 0.5}s`,
                }}
              >
                <SubjectCard
                  icon={subject.icon}
                  subject={subject.name}
                  topics={subject.topics}
                  topicsCount={subject.topicsCount}
                  questionsCount={subject.questionsCount}
                  isSelected={selectedSubject === subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Start Quiz Button */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={handleStartQuiz}
            disabled={!selectedSubject}
            className={`px-8 py-3 rounded-md font-medium transition-all duration-300 transform ${
              selectedSubject 
                ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 hover:shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;