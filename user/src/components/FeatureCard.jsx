const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20 hover:shadow-2xl group">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-white bg-opacity-20 rounded-full mb-4 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-white text-opacity-80">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;