import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile, setUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // API base URL - update this to match your backend URL
  const API_BASE_URL = "http://localhost:3000";

  const onSubmit = async (data) => {
    try {
      console.log("Creating user with:", data.name);
      
      // Create user with Firebase
      const result = await createUser(data.email, data.password);
      console.log("Firebase user created:", result.user);
      
      setUser(result.user);
      
      // Update Firebase profile
      await updateUserProfile({ displayName: data.name });
      
      // Create user in your backend database
      const newUser = {
        firebase_uid: result.user.uid,
        username: data.name.toLowerCase().replace(/\s+/g, ''), // Create username from name
        email: data.email,
        name: data.name,
        role: "user"
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/users`, newUser);
      console.log("User created in database:", response.data);
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your account has been created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      reset();
      navigate("/");
      
    } catch (error) {
      console.error("Signup error:", error);
      
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please use a different email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Google sign-in successful:", result.user);
      
      setUser(result.user);
      
      // Create or update user in your backend database
      const userData = {
        firebase_uid: result.user.uid,
        username: result.user.displayName?.toLowerCase().replace(/\s+/g, '') || result.user.email.split('@')[0],
        email: result.user.email,
        name: result.user.displayName || result.user.email,
        role: "user"
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
      console.log("User created/updated in database:", response.data);
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signed in successfully with Google!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      navigate("/");
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      let errorMessage = "Failed to sign in with Google. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Google Sign-in Failed",
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="py-12 flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-stone-300">
      <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-md w-96 lg:w-1/3">
        <h2 className="text-2xl font-semibold text-center mb-3">Sign Up</h2>
        <p className="text-center mb-6">
          Please fill up the form to create your account.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your Full Name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              {...register("name", {
                required: "Full Name is required",
                minLength: {
                  value: 3,
                  message: "Name should be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name should not exceed 50 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your Password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-stone-500 text-white p-2 rounded-md hover:bg-stone-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-stone-500 text-white py-2 rounded-lg hover:bg-stone-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500"
          >
            <p className="flex items-center justify-center">
              <FaGoogle />
              &nbsp; Sign In With Google
            </p>
          </button>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-stone-500 hover:text-stone-700 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;