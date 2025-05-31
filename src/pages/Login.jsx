import React, { useState } from "react";
import { useNavigate } from "react-router";
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from "../firebase/firebaseConfig";
import { Input } from "../components/Input";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setError({
        email: !data.email ? "Please enter email" : "",
        password: !data.password ? "Please enter password" : "",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError({ password: "Invalid email or password" });
      }
    }
    setLoading(false);
  };

  // handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    setError({});
    setResetMessage("");
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    setResetMessage("");
    setError({});
    if (!data.email) {
      setError({ email: "Please enter your email to reset password" });
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setResetMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setResetMessage("Failed to send reset email. Please check your email address.");
    }
    setResetLoading(false);
  };

  return (
    <div className="w-full md:w-1/2 mx-auto p-4">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2>Login</h2>
        <Input
          name={"email"}
          type={"email"}
          placeholder={"Enter email"}
          value={data.email}
          onChange={handleChange}
          error={error.email}
        />
        <Input
          name={"password"}
          type={"password"}
          placeholder={"Enter password"}
          value={data.password}
          onChange={handleChange}
          error={error.password}
        />
        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            className="text-blue-500 hover:underline text-sm"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            tabIndex={0}
          >
            {resetLoading ? "Sending..." : "Forgot password?"}
          </button>
        </div>
        {resetMessage && (
          <div className="text-green-600 text-sm text-center">{resetMessage}</div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md py-2 cursor-pointer hover:bg-blue-600 transition duration-200 font-bold mt-6 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
