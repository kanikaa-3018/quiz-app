import React from 'react';
import { useLocation } from 'wouter';

const LandingPage = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Tinker Tutor</div>
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#courses" className="hover:text-blue-600">Courses</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>
        <div className="space-x-4">
          <button onClick={() => setLocation('/admin/login')} className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">Login</button>
          <button onClick={() => setLocation('/admin/register')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-blue-700">Empowering Young Minds with Tech</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          Learn Robotics, IoT, AI and more — specially crafted for students from grade 5 to 12.
        </p>
        <button onClick={() => alert('Explore Coming Soon!')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Explore Courses
        </button>
      </section>

      {/* Features */}
      <section id="courses" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10 text-blue-700">Our Offerings</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'Robotics', icon: '🤖', desc: 'Build intelligent robots using kits and code.' },
            { title: 'IoT', icon: '🌐', desc: 'Connect devices to the internet and learn real-world automation.' },
            { title: 'AI Basics', icon: '🧠', desc: 'Get introduced to Artificial Intelligence in a fun way.' },
            { title: 'Electronics', icon: '🔌', desc: 'Hands-on experience with sensors, circuits, and hardware.' },
            { title: 'Game Development', icon: '🎮', desc: 'Make your own games and understand programming logic.' },
            { title: 'Python for Kids', icon: '🐍', desc: 'Learn the most loved programming language step-by-step.' },
          ].map((feature) => (
            <div key={feature.title} className="p-6 border rounded-lg shadow hover:shadow-lg transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-600">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-blue-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">About Tinker Tutor</h2>
          <p className="text-lg text-gray-700">
            Tinker Tutor is on a mission to bring innovation, creativity, and technology into classrooms. With expert instructors and project-based learning, we make complex subjects accessible and enjoyable for school students.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-4">Want to collaborate or ask something?</p>
        <a href="mailto:info@tinkertutor.com" className="text-blue-600 underline">info@tinkertutor.com</a>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Tinker Tutor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
