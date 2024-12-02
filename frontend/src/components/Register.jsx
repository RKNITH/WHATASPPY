import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import uploadFile from "../utils/uploadFile";
import axios from "axios";
import { toast } from "sonner";
const Register = () => {
  const navigate = useNavigate();
  const [RegisterData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [uploadImg, setUploadImg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRegisterData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleClearPhoto = (event) => {
    event.preventDefault();
    setUploadImg(null);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    const uploadImage = await uploadFile(file);
    setUploadImg(file);
    console.log(uploadImage, "image");

    setRegisterData((prev) => {
      return {
        ...prev,
        profilePic: uploadImage?.url,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event?.stopPropagation();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/register`,
        RegisterData
      );
      if (res.data.success) {
        toast.success(res?.data?.message);
        navigate("/login");
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
            label="Name"
            name="name"
            type="text"
            value={RegisterData?.name}
            placeholder="Enter the name"
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={RegisterData?.email}
            placeholder="Enter the email"
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={RegisterData?.password}
            placeholder="Enter the password"
            onChange={handleChange}
          />
          <div>
            <label htmlFor="profilePic">
              Porfile Picture:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary">
                <p className="text-sm mx-w-[300px] text-ellipsis line-clamp-1">
                  {uploadImg?.name || "upload profile photo"}
                </p>
                {uploadImg?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearPhoto}
                  >
                    <X />
                  </button>
                )}
              </div>
            </label>

            <input
              type="file"
              id="profilePic"
              name="profilePic"
              className="bg-slate-100 px-2 py-1 focus:outline-none hidden"
              onChange={handleUpload}
            />
          </div>
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

export default Register;
