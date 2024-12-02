import React, { useEffect, useRef, useState } from "react";
import FormInput from "./FormInput";
import Avatar from "./Avatar";
import uploadFile from "../utils/uploadFile";
import axios from "axios";
import { toast } from "sonner";

const EditProfile = ({ setEditProfile, user, setUser }) => {
  const [edituserData, setEdituserData] = useState({
    name: user?.name,
    userId: user?._id,
    profilePic: user?.profilePic,
  });
  const uploadRef = useRef();
  useEffect(() => {
    setEditProfile({
      name: user?.name,
      userId: user?._id,
      profilePic: user?.profilePic,
    });
  }, [user]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const res = await axios({
        method: "put",
        url: `${process.env.REACT_APP_BACKEND_URL}/api/updateUser`,
        data: edituserData,
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setUser({ ...res?.data?.user, token: user?.token });
        setEditProfile(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEdituserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    const uploadImage = await uploadFile(file);
    console.log(uploadImage, "uploadImage");

    setEdituserData((prev) => {
      return {
        ...prev,
        profilePic: uploadImage?.url,
      };
    });
  };
  const handleOpenUploadPhoto = (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadRef.current.click();
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-80 p-2 z-10 flex justify-center items-center">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user profiule</p>
        <form onSubmit={handleSubmit} className="grid gap-3 mt-3">
          <FormInput
            label="Name"
            name="name"
            type="text"
            value={edituserData?.name}
            placeholder="Enter the name"
            onChange={handleChange}
            className="border border-black"
          />
          <div>
            <h2>Profile Picture</h2>
            <div>
              <Avatar
                imageUrl={edituserData?.profilePic}
                name={edituserData?.name}
              />
              <label htmlFor="profilePic">
                <button
                  className="text-lg ml-2 hover:text-red-600"
                  onClick={handleOpenUploadPhoto}
                >
                  Change profile picture
                </button>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  className="bg-slate-100 px-2 py-1 focus:outline-none hidden"
                  onChange={handleUpload}
                  ref={uploadRef}
                />
              </label>
            </div>
          </div>
          <hr />
          <div className="flex justify-between">
            <button
              onClick={() => setEditProfile(false)}
              className="border-primary border px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border-primary border px-4 py-1 rounded bg-primary text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
