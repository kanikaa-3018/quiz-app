import { Link, Navigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import StatCard from '../components/StatCard';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { userData, isAuthenticated } = useUser();
  
  // If the user is not authenticated, redirect to sign in
  if (!isAuthenticated || !userData) {
    return <Navigate to="/signin" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {userData.firstName}!</h1>
              <p>Class {userData.class} - {userData.stream}</p>
            </div>
            <div className="text-right">
              <div className="text-sm mb-1">Overall Progress</div>
              <div className="w-64 bg-blue-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-2.5 rounded-full" 
                  style={{ width: '78%' }}
                ></div>
              </div>
              <div className="text-right mt-1">78%</div>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<i className="fas fa-clipboard-list text-blue-500 text-xl"></i>}
            value={userData.stats.quizzesTaken}
            label="Quizzes Taken"
            bgColor="bg-blue-100"
          />
          <StatCard 
            icon={<i className="fas fa-trophy text-green-500 text-xl"></i>}
            value={`${userData.stats.averageScore}%`}
            label="Average Score"
            bgColor="bg-green-100"
          />
          <StatCard 
            icon={<i className="fas fa-fire text-purple-500 text-xl"></i>}
            value={userData.stats.dayStreak}
            label="Day Streak"
            bgColor="bg-purple-100"
          />
          <StatCard 
            icon={<i className="fas fa-clock text-orange-500 text-xl"></i>}
            value={`${userData.stats.timeSpent}h`}
            label="Time Spent"
            bgColor="bg-orange-100"
          />
        </div>
        
        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                to="/take-quiz" 
                className="flex items-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                <i className="fas fa-play mr-3"></i>
                <span>Start New Quiz</span>
              </Link>
              <Link 
                to="/reports" 
                className="flex items-center p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                <i className="fas fa-chart-bar mr-3"></i>
                <span>View Performance</span>
              </Link>
              <button className="flex items-center w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                <i className="fas fa-bullseye mr-3"></i>
                <span>Practice Weak Areas</span>
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {userData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center p-4 border-b last:border-0">
                  <div className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center ${
                    activity.subject === 'Physics' ? 'bg-blue-100' : 
                    activity.subject === 'Chemistry' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <i className={`fas ${
                      activity.subject === 'Physics' ? 'fa-atom' : 
                      activity.subject === 'Chemistry' ? 'fa-flask' : 'fa-square-root-alt'
                    }`}></i>
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{activity.subject} - {activity.topic} Quiz</div>
                    <div className="text-sm text-gray-500">Scored {activity.score}% • {activity.timeAgo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;