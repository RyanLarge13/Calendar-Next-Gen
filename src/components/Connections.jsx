import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosAddCircle } from "react-icons/io";
import {
  AiOutlineMail,
  AiOutlineQrcode,
  AiOutlineArrowDown,
} from "react-icons/ai";
import { sendFriendRequestByEmail } from "../utils/api";
import QRCodeScanner from "./QRCodeScanner";
import UserContext from "../context/UserContext";

const Connections = ({ setOption }) => {
  const {
    user,
    friends,
    friendRequests,
    connectionRequests,
    setFriends,
    qrCodeUrl,
  } = useContext(UserContext);

  const [pick, setPick] = useState(false);
  const [qrOptions, setQrOptions] = useState(false);
  const [emailAdd, setEmailAdd] = useState(false);
  const [email, setEmail] = useState("");
  const [openCamera, setOpenCamera] = useState(false);

  const finish = (e, info) => {
    const dragDistance = info.offset.y;
    const cancelThreshold = 175;

    if (dragDistance > cancelThreshold) {
      setOption(null);
    }
    if (dragDistance < cancelThreshold) {
      return;
    }
  };

  const addFriendByEmail = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (token) {
      sendFriendRequestByEmail(email, token)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0 }}
      dragSnapToOrigin={true}
      onDragEnd={finish}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-white z-50 p-5 overflow-y-auto scrollbar-hide"
    >
      <div className="relative">
        <h2 className="text-4xl pb-2 border-b">Connections</h2>
        <div
          onClick={() => setOption(null)}
          className="absolute top-0 bottom-0 right-0 text-lg"
        >
          <AiOutlineArrowDown />
        </div>
      </div>
      <div className="mt-50">
        <p>Friend Requests</p>
        {friendRequests.length > 0 ? (
          friendRequests.map((friendReq) => (
            <div
              key={friendReq.sender.email}
              className="p-3 rounded-md shadow-md my-3"
            >
              <div className="flex justify-between items-end">
                <img
                  src={friendReq.sender.avatarUrl}
                  alt="users avatar"
                  className="w-[50px] h-[50px] rounded-full shadow-md"
                />
                <div className="text-right">
                  <p className="text-sm mt-2">{friendReq.sender.username}</p>
                  <p className="text-sm">{friendReq.sender.email}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <button className="px-3 py-2 text-xs rounded-md shadow-md bg-red-300 font-semibold">
                  Deny
                </button>
                <button className="px-3 py-2 text-xs rounded-md shadow-md bg-lime-300 font-semibold">
                  Accept
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No friend requests</p>
        )}
      </div>
      <div className="mt-5">
        <p>Your Friends</p>
        <div className="mt-3">
          {friends.length > 0 ? (
            friends.map((friend) => <div></div>)
          ) : (
            <div className="p-5 flex flex-col justify-center items-center bg-cyan-100 shadow-md rounded-md">
              <p>No friends</p>
              <button
                type="button"
                className="flex flex-col justify-center items-center mt-3 py-1 px-3 rounded-md shadow-md bg-white"
                onClick={() => setPick(true)}
              >
                <p>Create Connection</p>
                <IoIosAddCircle />
              </button>
              {pick && (
                <motion.div className="my-3 flex justify-center items-center">
                  <button
                    onClick={() => {
                      setEmailAdd(false);
                      setQrOptions(true);
                    }}
                    className="px-3 py-2 rounded-md shadow-md mx-3 bg-white text-lg"
                  >
                    <AiOutlineQrcode />
                  </button>
                  <button
                    onClick={() => {
                      setQrOptions(false);
                      setEmailAdd(true);
                    }}
                    className="px-3 py-2 rounded-md shadow-md mx-3 bg-white text-lg"
                  >
                    <AiOutlineMail />
                  </button>
                </motion.div>
              )}
              {qrOptions && (
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={qrCodeUrl}
                    alt="user qr code"
                    className="w-40 h-40 rounded-md shadow-md"
                  />
                  <button
                    onClick={() =>
                      openCamera ? setOpenCamera(false) : setOpenCamera(true)
                    }
                    className="px-3 py-2 rounded-md shadow-md bg-white mt-5"
                  >
                    {openCamera ? "cancel" : "Or Scan Your Friends!"}
                  </button>
                  {openCamera && <QRCodeScanner />}
                </div>
              )}
              {emailAdd && (
                <form
                  onSubmit={(e) => addFriendByEmail(e)}
                  className="w-full px-3"
                >
                  <input
                    placeholder="Users Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-md shadow-md bg-white focus:outline-none w-full"
                  />
                </form>
              )}
            </div>
          )}
        </div>
        {connectionRequests.length > 0 ? (
          connectionRequests.map((connectionReq) => (
            <div
              key={connectionReq.recipient.email}
              className="flex justify-between items-end p-3 rounded-md shadow-md my-3 relative bg-slate-100"
            >
              <button className="absolute px-3 py-2 text-xs top-0 right-0 rounded-md shadow-md bg-red-300 font-semibold">
                Cancel Request
              </button>
              <div>
                <img
                  src={connectionReq.recipient.avatarUrl}
                  alt="users avatar"
                  className="w-[50px] h-[50px] rounded-full shadow-md"
                />
                <p className="text-sm mt-2">STATUS: pending</p>
              </div>
              <div className="text-right">
                <p className="text-sm mt-2 font-semibold">
                  {connectionReq.recipient.username}
                </p>
                <p className="text-sm">
                  <a href={`mailto:${connectionReq.recipient.email}`}>
                    {connectionReq.recipient.email}
                  </a>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No connection requests sent out</p>
        )}
      </div>
    </motion.div>
  );
};

export default Connections;
