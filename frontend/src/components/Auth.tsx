import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupInput } from "@kaivan_shah/medium-common";
import axios from "axios";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInput, setPostInput] = useState<signupInput>({
    email: "",
    password: "",
    name: "",
  });

  const BACKEND_URL = "https://backend.shahkai999.workers.dev";

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInput
      );

      const jwt = response.data.jwt;
      localStorage.setItem("jwt", jwt);
      navigate("/blogs");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="mx-auto flex flex-col">
        <div className="text-3xl font-bold">Create an account</div>
        <div className="text-sm text-slate-500">
          {type === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}
          <Link to={type === "signin" ? "/signup" : "/signin"}>
            {type === "signin" ? "Sign Up" : "Login"}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-3 mx-auto w-1/2">
        {type === "signup" ? (
          <LabelledInput
            label="username"
            placeholder="Enter your username"
            type="text"
            onChange={(e) => {
              setPostInput({ ...postInput, name: e.target.value });
            }}
          />
        ) : null}
        <LabelledInput
          label="email"
          placeholder="Enter your email"
          type="text"
          onChange={(e) => {
            setPostInput({ ...postInput, email: e.target.value });
          }}
        />
        <LabelledInput
          label="password"
          placeholder="Enter your password"
          type="password"
          onChange={(e) => {
            setPostInput({ ...postInput, password: e.target.value });
          }}
        />
        <button
          className="bg-black text-white p-2 rounded-md"
          onClick={sendRequest}
        >
          {type === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;

interface LabelledInputProps {
  label: string;
  placeholder: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputProps) {
  return (
    <div>
      <div>
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <input
          type={type}
          id={label}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          required
          onChange={onChange}
        />
      </div>
    </div>
  );
}
