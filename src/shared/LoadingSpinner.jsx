import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full"
      />
    </div>
  );
}
