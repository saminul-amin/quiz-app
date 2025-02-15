import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-16 bg-gradient-to-b from-stone-100 to-stone-300 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Text Content */}
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Test Your Knowledge, Challenge Yourself!
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl opacity-80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Join a platform where teachers create engaging quizzes and track
            rankings. Compete, Learn, and Shine!
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex space-x-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <Link to="/signup">
              <button className="px-6 py-3 bg-stone-500 text-white font-semibold rounded-full shadow-lg hover:bg-stone-700 transition transform hover:scale-105">
                Sign Up & Start Quizzing
              </button>
            </Link>
            <Link to="/quizzes">
              <button className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-full shadow-lg hover:bg-stone-300 transition transform hover:scale-105">
                Explore Open Quizzes
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
