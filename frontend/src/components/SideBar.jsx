import React, { useEffect, useState } from "react";
import { GetSocket } from "../utils/SocketProvider";
import {
  ArrowUpLeft,
  EllipsisVertical,
  Image,
  LogOut,
  MessageCircle,
  SquarePlus,
  UserPlus,
  Video,
} from "lucide-react";
import Avatar from "./Avatar";
import { useLocalStorage } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import AddUser from "./AddUser";
import EditProfile from "./EditProfile";

const SideBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const socket = GetSocket();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit("siderbar", user?._id);

      socket.on("conversation", (data) => {
        const conversationUserData = data?.map((convUser) => {
          if (convUser?.receiver?._id !== user?._id) {
            return {
              ...convUser,
              userDetails: convUser?.receiver,
            };
          } else {
            return {
              ...convUser,
              userDetails: convUser?.sender,
            };
          }
        });
        setAllUsers(conversationUserData);
      });
    }
  }, [socket, user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="bg-secondary h-full py-5 flex flex-col items-center justify-between">
        <div>
          <div className="w-12 h-12 flex justify-center items-center cursor-pointer text-slate-300 hover:text-slate-200 rounded">
            <MessageCircle size={20} />
          </div>

          <div
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer text-slate-300 hover:text-slate-200 rounded"
          >
            <UserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => setEditProfile(true)}>
            <Avatar
              imageUrl={user?.profilePic}
              name={user?.name}
              userId={user?._id}
            />
          </button>
          <button title="logout" onClick={handleLogout}>
            <span className="-ml-2 text-slate-300 hover:text-slate-200">
              <LogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full bg-primary border-r-2 border-r-secondary">
        <div className="h-16 px-3 flex items-center justify-between">
          <h2 className="text-xl font-bold p-4 text-gray-300">Chats</h2>
          <div className="flex gap-2 text-slate-300">
            <SquarePlus size={20} className="cursor-pointer" />
            <EllipsisVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUsers?.length ? (
            allUsers?.map((conv) => {
              return (
                <Link
                  to={"/" + conv?.userDetails?._id}
                  key={conv?._id}
                  className="flex items-center gap-2 border border-transparent hover:bg-secondary cursor-pointer"
                >
                  <div className="ml-2">
                    <Avatar
                      imageUrl={conv?.userDetails?.profilePic}
                      name={conv?.userDetails?.name}
                    />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-ellipsis line-clamp-1 font-semibold text-base">
                      {conv?.userDetails?.name}
                    </h3>
                    <div className="flex gap-2">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex gap-2 items-center text-gray-500">
                          <Image />
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex gap-2 items-center text-gray-500">
                          <Video />
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                      <p className="text-ellipsis line-clamp-1 text-gray-500">
                        {conv?.lastMsg?.text}
                      </p>
                    </div>
                  </div>
                  {Boolean(conv?.unseenMsg) && (
                    <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                      {conv?.unseenMsg}
                    </p>
                  )}
                </Link>
              );
            })
          ) : (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <ArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Add user to start chat
              </p>
            </div>
          )}
        </div>
      </div>
      {openSearchUser && <AddUser setOpenSearchUser={setOpenSearchUser} />}
      {editProfile && (
        <EditProfile
          setEditProfile={setEditProfile}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
};

export default SideBar;
