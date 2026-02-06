import { useContext, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { AiOutlineMail, AiOutlineQrcode } from "react-icons/ai";
import QRCodeScanner from "./Misc/QRCodeScanner";
import UserContext from "../context/UserContext";

const Friends = () => {
  const { friends, qrCodeUrl } = useContext(UserContext);

  const [pick, setPick] = useState(false);
  const [qrOptions, setQrOptions] = useState(false);
  const [emailAdd, setEmailAdd] = useState(false);
  const [email, setEmail] = useState("");
  const [openCamera, setOpenCamera] = useState(false);

  const addFriendByEmail = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (token) {
      sendFriendRequestByEmail(email, token)
        .then((res) => {
          const newRequest = res.data.request;
          const responseMessage = res.data.message;
          const newSuccess = {
            show: true,
            title: "Request Sent",
            text: `A new friend request was sent to ${newRequest.email} and is awaiting acceptance`,
            color: "bg-cyan-300",
            hasCancel: false,
            actions: [
              { text: "close", func: () => setSystemNotif({ show: false }) },
            ],
          };
          setSystemNotif(newSuccess);
          setConnectionRequests((prevReqs) => [...prevReqs, newRequest]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="mt-3">
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.id} className="p-3 rounded-md shadow-md">
            <img
              src={friend.friendAvatar}
              alt="user"
              className="w-[30px] h-[30px] rounded-full shadow-md"
            />
            <p>{friend.friendEmail}</p>
          </div>
        ))
      ) : (
        <div className="p-5 flex flex-col justify-center items-center bg-cyan-100 shadow-md rounded-md">
          <p>You have no friends create a new connection!!</p>
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
            <form onSubmit={(e) => addFriendByEmail(e)} className="w-full px-3">
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
  );
};

export default Friends;
