import { useContext } from "react";
import { acceptFriendRequest } from "../../../utils/api";
import UserContext from "../../../context/UserContext";

const FriendRequest = () => {
  const { friendRequests, setSystemNotif } = useContext(UserContext);

  const confirmAccept = (reqEmail) => {
    const newConfirmation = {
      show: true,
      title: `Accept Connection`,
      text: `Are you sure you want to accept this friend request from ${reqEmail}? Please make sure you know this user and feel safe connecting with them`,
      color: "bg-cyan-300",
      hasCancel: true,
      actions: [
        { text: "cancel", func: () => setSystemNotif({ show: false }) },
        { text: "accept", func: () => acceptRequest(reqEmail) },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const acceptRequest = (reqEmail) => {
    setSystemNotif({ show: false });
    const token = localStorage.getItem("authToken");
    if (!token) {
      return;
    }
    acceptFriendRequest(token, reqEmail)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mt-50">
      <p className="font-semibold my-3">Friend Requests</p>
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
              <button
                onClick={() => confirmAccept(friendReq.sender.email)}
                className="px-3 py-2 text-xs rounded-md shadow-md bg-lime-300 font-semibold"
              >
                Accept
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>You have no new friend requests</p>
      )}
    </div>
  );
};

export default FriendRequest;
