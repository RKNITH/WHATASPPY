import { useLocalStorage } from "@mantine/hooks";
import { Delete, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import axios from "axios";
import { toast } from "sonner";

const AddUser = ({ setOpenSearchUser }) => {
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);

  const handleUser = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/searchUser`,
        {
          search,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            Accept: "application/json",
          },
        }
      );
      setLoading(false);
      console.log(res);

      const data = res?.data?.users?.filter((item) => item?._id !== user?._id);
      setSearchUser(data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleUser();
  }, [user, search]);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-80 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user"
            className="w-full outline-none  py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-full w-14 flex justify-center items-center ">
            <Search size={25} />
          </div>
        </div>

        <div className="bg-white mt-2 w-full rounded h-full max-h[70vh] overflow-scroll">
          {searchUser?.length ? (
            searchUser?.map((item, index) => (
              <Link
                to={"/" + item?._id}
                key={index}
                className="flex items-center gap-3 lg:p-4 border border-transparent border-b-slate-200"
              >
                <Avatar
                  name={item?.name}
                  userId={item?._id}
                  imageUrl={item?.profilePic}
                />
                <div className=" text-ellipsis line-clamp-1">
                  <p className="font-semibold">{item?.name}</p>
                  <p className="text-sm">{item?.email}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-slate-500 mt-5">No User found.</p>
          )}
        </div>
      </div>
      <div
        className="absolute top-5 right-5 text-2xl text-white cursor-pointer"
        onClick={() => setOpenSearchUser(false)}
      >
        <Delete size={30} />
      </div>
    </div>
  );
};

export default AddUser;
