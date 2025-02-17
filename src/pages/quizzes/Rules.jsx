import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Rules = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    axios.get("/rules.json").then((res) => setRules(res.data.quiz_rules));
  }, []);

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Quiz Rules</h2>
      <ul className="list-disc pl-5 space-y-2">
        {rules.map((rule, index) => (
          <motion.li
            key={index}
            className="text-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {rule}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Rules;
