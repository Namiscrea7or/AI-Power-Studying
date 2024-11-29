import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Define the structure of form data
type SignInFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  // Form submission handler
  const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
    alert(`Sign in successful! \nEmail: ${data.email}`);
  };

  const handleOAuthSignIn = (provider: string) => {
    alert(`Sign in with ${provider}!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign In to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            Sign In
          </button>
        </form>
        <div className="mt-6">
          <p className="text-center text-gray-500">Or sign in with</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => handleOAuthSignIn("Google")}
              className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleOAuthSignIn("GitHub")}
              className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none">
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub logo"
                className="w-5 h-5"
              />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
