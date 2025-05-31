import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebaseConfig";
import { Input } from "../components/Input";

const Signup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // set error
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state

  const validationConfig = {
    name: [
      { required: true, message: "Please enter name" },
      { pattern: /^[a-zA-Z ]+$/, message: "Please enter valid name" },
    ],
    email: [
      { required: true, message: "Please enter email" },
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter valid email",
      },
    ],
    password: [
      { required: true, message: "Please enter password" },
      {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message:
          "Password must be at least 8 characters, include a letter and a number",
      },
    ],
  };

  const validation = (formData) => {
    const errorsData = {};
    Object.entries(formData).forEach(([key, value]) => {
      validationConfig[key].some((rule) => {
        if (rule.required && !value) {
          errorsData[key] = rule.message;
          return true;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errorsData[key] = rule.message;
          return true;
        }
      });
    });

    setError(errorsData);
    return errorsData;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const validate = validation(data);
    if (Object.keys(validate).length) return;

    setLoading(true); // Start loading
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, { displayName: data.name });

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError({
          email: "Email already in use. Please use a different email.",
        });
      }
    }
    setLoading(false); // Stop loading
    return;
  };

  // handleChange on input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    setError({});
  };

  return (
    <div className=" w-full md:w-1/2 mx-auto ">
      <form onSubmit={handleSignup} className="flex flex-col gap-4 ">
        <h2>Signup</h2>

        <Input
          title={"Name"}
          type={"text"}
          name={"name"}
          placeholder={"Enter Name"}
          value={data.name}
          onChange={handleChange}
          error={error.name}
        />

        <Input
          title={"Email"}
          type={"email"}
          name={"email"}
          placeholder={"Enter Email"}
          value={data.email}
          onChange={handleChange}
          error={error.email}
        />

        <Input
          title={"Password"}
          type={"password"}
          name={"password"}
          placeholder={"Enter Password"}
          value={data.password}
          onChange={handleChange}
          error={error.password}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md py-2 cursor-pointer hover:bg-blue-600 transition duration-200 font-bold mt-12 sm:mt-8 mb-2 flex items-center justify-center gap-2"
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
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
