import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Handle form submission logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-stone-300 py-12">
      <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-md w-96 lg:w-1/3">
        <h2 className="text-2xl font-semibold text-stone-700 mb-3 text-center">Contact Us</h2>
        <p className="text-center mb-6">Feel free to reach out—we'd love to hear from you!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-stone-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              required
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              required
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-stone-500 text-white py-2 rounded-lg hover:bg-stone-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
