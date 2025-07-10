const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Varied Animated background elements - Responsive */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Large circles */}
        <div className="absolute top-4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-4 right-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400/5 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Medium squares */}
        <div
          className="absolute top-8 right-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-green-400/4 blur-xl footer-square"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-8 left-1/3 w-12 h-12 sm:w-14 sm:h-14 bg-pink-400/4 blur-lg footer-square"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Small diamonds */}
        <div
          className="absolute top-16 left-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/6 blur-md footer-diamond"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-16 right-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-orange-400/5 blur-md footer-diamond"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Triangular shapes */}
        <div
          className="absolute top-1/3 right-1/6 w-14 h-14 sm:w-18 sm:h-18 bg-indigo-400/4 blur-lg footer-triangle"
          style={{ animationDelay: "1.8s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-12 h-12 sm:w-16 sm:h-16 bg-red-400/4 blur-xl footer-triangle"
          style={{ animationDelay: "2.2s" }}
        ></div>

        {/* Hexagonal shapes */}
        <div
          className="absolute top-20 right-1/5 w-18 h-18 sm:w-22 sm:h-22 bg-teal-400/5 blur-lg footer-hexagon"
          style={{ animationDelay: "0.8s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-14 h-14 sm:w-18 sm:h-18 bg-violet-400/4 blur-md footer-hexagon"
          style={{ animationDelay: "3.5s" }}
        ></div>

        {/* Oval shapes */}
        <div
          className="absolute top-1/4 left-3/4 w-20 h-12 sm:w-28 sm:h-16 bg-lime-400/3 blur-2xl footer-oval"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-3/4 w-16 h-10 sm:w-20 sm:h-12 bg-amber-400/4 blur-xl footer-oval"
          style={{ animationDelay: "2.8s" }}
        ></div>

        {/* Star shapes */}
        <div
          className="absolute top-12 left-2/3 w-12 h-12 sm:w-14 sm:h-14 bg-rose-400/5 blur-lg footer-star"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute bottom-12 right-2/3 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-400/4 blur-md footer-star"
          style={{ animationDelay: "2.7s" }}
        ></div>

        {/* Additional small circles for depth */}
        <div
          className="absolute top-6 left-1/8 w-6 h-6 sm:w-8 sm:h-8 bg-sky-400/6 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-6 right-1/8 w-5 h-5 sm:w-6 sm:h-6 bg-fuchsia-400/5 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "4.5s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-4 sm:mb-6 hover:text-blue-300 transition-colors duration-300 cursor-default animate-fade-in">
          Tinker Tutor
        </h2>
        <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-delay text-sm sm:text-base px-4">
          Empowering students with innovative learning solutions. Join thousands of learners who have transformed their
          academic journey with our comprehensive educational platform designed for success.
        </p>
        <div className="border-t border-gray-700 pt-4 sm:pt-6 animate-fade-in-delay-2">
          <p className="text-gray-500 text-xs sm:text-sm hover:text-gray-400 transition-colors duration-300">
            © 2025 Tinker Tutor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer