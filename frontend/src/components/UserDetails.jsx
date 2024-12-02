import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import backgroundImage from "../assets/wallapaper.jpeg";
import Avatar from "./Avatar";
import { GetSocket } from "../utils/SocketProvider";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import {
  Delete,
  EllipsisVertical,
  Image,
  Plus,
  Send,
  Video,
} from "lucide-react";
import moment from "moment";
import uploadFile from "../utils/uploadFile";

const UserDetails = () => {
  const params = useParams();
  const socket = GetSocket();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePic: "",
    online: false,
    _id: "",
  });
  const [message, setMessage] = useState({
    text: "",
    videoUrl: "",
    imageUrl: "",
  });
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });

  useEffect(() => {
    if (socket) {
      socket.emit("messagePage", params?.userId);
      socket.on("messageUser", (data) => {
        setUserData(data);
      });

      socket.on("message", (data) => {
        setAllMessages(data);
      });

      socket.emit("seen", params?.userId);
    }
  }, [socket, params?.userId, user]);
  console.log(allMessages, "userData");

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message?.text || message?.imageUrl || message?.videoUrl) {
      if (socket) {
        socket.emit("newMessage", {
          sender: user?._id,
          receiver: params?.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUserId: user?._id,
        });

        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  const handleUpload = async (event, type) => {
    const file = event.target.files?.[0];
    setLoading(true);
    const upload = await uploadFile(file);
    console.log(upload, "upload");
    setLoading(false);
    setToggle(false);
    setMessage({ ...message, [type]: upload?.url });
  };
  return (
    <DashboardLayout>
      <div
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="bg-no-repeat bg-cover"
      >
        <header className="sticky top-0 h-16 bg-secondary flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <Avatar
              imageUrl={userData?.profilePic}
              name={userData?.name}
              userId={userData?._id}
            />
            <div>
              <h3 className="font-semibold text-gray-300 text-lg my-0 text-ellipsis line-clamp-1">
                {userData?.name}
              </h3>
              <p className="text-sm">
                {userData?.online ? (
                  <span className="text-green-500">online</span>
                ) : (
                  <span className="text-slate-400">offline</span>
                )}
              </p>
            </div>
          </div>
          <EllipsisVertical
            size={20}
            className="cursor-pointer text-slate-200"
          />
        </header>

        {/* all messages  */}
        <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-primary bg-opacity-95">
          <div className="flex flex-col gap-2 py-2 mx-2">
            {allMessages?.length
              ? allMessages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-1 rounded w-fit max-w-96 ${
                      user?._id === msg?.msgByUser
                        ? "ml-auto bg-[#00a884]"
                        : "bg-secondary"
                    }`}
                  >
                    <div className="w-full relative">
                      {msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl}
                          className="w-full h-full object-scale-down"
                        />
                      )}
                      {msg?.videoUrl && (
                        <video
                          src={msg?.videoUrl}
                          className="w-full h-full object-scale-down"
                          controls
                        />
                      )}
                    </div>
                    <p className="px-2 text-white">{msg?.text}</p>
                    <p className="text-sm ml-auto w-fit text-gray-300">
                      {moment(msg?.createdAt).format("hh:mm")}
                    </p>
                  </div>
                ))
              : null}
          </div>

          {/* display image  */}
          {message?.imageUrl && (
            <div className="w-full  h-full sticky bottom-0 bg-primary bg-opacity-90 flex justify-center items-center rounded overflow-hidden">
              <div
                className="w-fit absolute top-2 right-2 cursor-pointer text-white hover:text-red-600"
                onClick={() => setMessage({ ...message, imageUrl: "" })}
              >
                <Delete />
              </div>
              <div className="bg-secondary p-2">
                <img
                  src={message?.imageUrl}
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                  alt=""
                />
              </div>
            </div>
          )}

          {message?.videoUrl && (
            <div className="w-full  h-full sticky bottom-0 bg-primary bg-opacity-90 flex justify-center items-center rounded overflow-hidden">
              <div
                className="w-fit absolute top-2 right-2 cursor-pointer text-white hover:text-red-600"
                onClick={() => setMessage({ ...message, videoUrl: "" })}
              >
                <Delete size={30} />
              </div>
              <div className="bg-secondary p-2">
                <video
                  src={message?.videoUrl}
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )}

          {loading && (
            <div className="w-full  h-full sticky bottom-0 bg-primary bg-opacity-90 flex justify-center items-center rounded overflow-hidden">
              <div className="flex justify-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading</span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="h-16 bg-secondary flex items-center px-4">
          <div className="relative">
            <button
              className="flex justify-center items-center w-11 h-11 rounded-full text-gray-300"
              onClick={() => setToggle(!toggle)}
            >
              <Plus size={20} />
            </button>
          </div>
          <form
            onSubmit={handleSendMessage}
            className="h-full w-full flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Type here message.."
              className="py-1 px-4 outline-none w-full h-12 rounded-lg bg-[#344047] text-white"
              value={message?.text}
              onChange={(event) =>
                setMessage({ ...message, text: event?.target?.value })
              }
            />
            <button type="submit" className="text-gray-300">
              <Send size={28} />
            </button>

            {toggle && (
              <div className="bg-secondary text-gray-300 shadow rounded absolute bottom-14 w-36">
                <form>
                  <label
                    htmlFor="uploadImage"
                    className="flex items-center p-2 px-3 gap-3 hover:bg-gray-600 cursor-pointer"
                  >
                    <div className="text-purple-500">
                      <Image size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label
                    htmlFor="uploadVideo"
                    className="flex items-center p-2 px-3 gap-3 hover:bg-gray-600 cursor-pointer"
                  >
                    <div className="text-purple-500">
                      <Video size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type="file"
                    id="uploadImage"
                    onChange={(e) => handleUpload(e, "imageUrl")}
                    className="hidden"
                  />

                  <input
                    type="file"
                    id="uploadVideo"
                    onChange={(e) => handleUpload(e, "videoUrl")}
                    className="hidden"
                  />
                </form>
              </div>
            )}
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails;
