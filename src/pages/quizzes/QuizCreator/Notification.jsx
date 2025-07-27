import { CheckCircle, AlertCircle } from "lucide-react";

const Notification = ({ notification }) => {
  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
        notification.type === "success"
          ? "bg-emerald-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {notification.type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      {notification.message}
    </div>
  );
};

export default Notification;
