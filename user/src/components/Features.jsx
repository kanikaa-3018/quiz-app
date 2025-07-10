import FeatureCard from './FeatureCard';

const Features = () => {
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;