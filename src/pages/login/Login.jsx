import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { userSignIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    userSignIn(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="py-12 flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-stone-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 lg:w-1/3">
        <h2 className="text-2xl font-bold text-center mb-3">Sign In</h2>
        <p className="text-center mb-6">
          Please enter your credentials to continue.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-stone-500 text-white py-2 rounded-lg hover:bg-stone-700 transition duration-200"
          >
            Login
          </button>
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

export default Login;
