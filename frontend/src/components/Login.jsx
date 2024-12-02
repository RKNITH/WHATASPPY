import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useLocalStorage } from "@mantine/hooks";
const Login = () => {
  const [, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event?.stopPropagation();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        loginData
      );
      if (res.data.success) {
        const data = { ...res?.data?.user, token: res?.data?.token };
        setUser(data);
        toast.success(res?.data?.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="grid place-content-center h-screen">
      <div className="bg-white w-96 rounded p-5 shadow-md">
        <div className="w-fit mx-auto mb-2">
          <UserCircle size={80} />
        </div>

        <h3>Welcome to whatsapp</h3>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-3">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={loginData?.email}
            placeholder="Enter the email"
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={loginData?.password}
            placeholder="Enter the password"
            onChange={handleChange}
          />
          <SubmitButton>Submit</SubmitButton>
        </form>
        <p className="mt-3 text-center">
          New User ?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
