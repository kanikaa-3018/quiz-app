import { Link } from 'react-router-dom';
import FeatureCard from './FeatureCard';

const HeroSection = () => {
  const features = [
    {
      icon: <i className="fas fa-graduation-cap text-blue-500 text-2xl"></i>,
      title: "Classes 5-12",
      description: "Comprehensive coverage for all grade levels"
    },
    {
      icon: <i className="fas fa-flask text-blue-500 text-2xl"></i>,
      title: "PCM/PCB Focus",
      description: "Specialized content for science streams"
    },
    {
      icon: <i className="fas fa-chart-line text-blue-500 text-2xl"></i>,
      title: "Track Progress",
      description: "Detailed analytics and performance reports"
    }
  ];

  return (
    <section className="py-20 text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-7xl font-bold mb-2 animate-fade-in">
          Master Your Studies with
        </h1>
        <h1 className="text-4xl md:text-7xl font-bold mb-6 text-yellow-300 animate-pulse-slow">
          <span className="inline-block animate-float-subtle">Tinker Tutor</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 animate-fade-in-delay opacity-0">
          Unlock your academic potential with personalized learning experiences designed for students from Classes 5-12. Get expert guidance, track your progress, and excel in your studies.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-bounce-subtle"
        >
          Start Learning
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="opacity-0" 
              style={{ 
                animation: `fade-in-up 0.8s ease-out forwards ${0.3 + index * 0.2}s`,
              }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;