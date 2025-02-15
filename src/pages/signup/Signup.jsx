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
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data.name);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your account has been created",
          showConfirmButton: false,
          timer: 1500,
        });
        const newUser = {
          name: data.name,
          email: data.email,
          role: "user",
        };
        axios
          .post("http://localhost:5000/users", newUser)
          .then((res) => console.log(res.data));
        reset();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="py-12 flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-stone-300">
      <div className=" bg-white p-8 border border-gray-300 rounded-lg shadow-md w-96 lg:w-1/3">
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
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("name", {
                required: "Full Name is required",
                minLength: {
                  value: 3,
                  message: "Name should be at least 3 characters",
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
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should be at least 6 characters",
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
          <div className="mb-4">
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
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full bg-stone-500 text-white p-2 rounded-md hover:bg-stone-700"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div>
          <button
            type="submit"
            className="mt-6 w-full bg-stone-500 text-white py-2 rounded-lg hover:bg-stone-700 transition duration-200"
          >
            <p className="flex items-center justify-center">
              <FaGoogle />
              &nbsp; Sign In With Google
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
