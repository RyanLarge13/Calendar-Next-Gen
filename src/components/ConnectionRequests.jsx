import { useContext } from "react";
import UserContext from "../context/UserContext";
import { cancelAFriendRequest } from "../utils/api";

const ConnectionRequests = () => {
  const { connectionRequests, setConnectionRequests, setSystemNotif } =
    useContext(UserContext);

  const confirmCancel = (recipientsEmail) => {
    const newConfirmation = {
      show: true,
      title: "Cancel Request",
      text: `Are you sure you want to cancel your friend request to ${recipientsEmail}`,
      color: "bg-purple-200",
      hasCancel: true,
      actions: [
        { text: "close", func: () => setSystemNotif({ show: false }) },
        {
          text: "cancel request",
          func: () => cancelFriendRequest(recipientsEmail),
        },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const cancelFriendRequest = (recipientsEmail) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
    }
    if (token) {
      cancelAFriendRequest(token, recipientsEmail)
        .then((res) => {
          const newSuccess = {
            show: true,
            title: "Canceled Friend Request",
            text: `Your friend request to ${recipientsEmail} was successfully canceled`,
            color: "bg-green-300",
            hasCancel: false,
            actions: [
              {
                text: "close",
                func: () => setSystemNotif({ show: false }),
              },
              { text: "undo", func: () => {} },
            ],
          };
          setSystemNotif(newSuccess);
          const filteredRequests = connectionRequests.filter(
            (req) => req.email !== recipientsEmail
          );
          setConnectionRequests(filteredRequests);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <dir>
      {connectionRequests.length > 0 ? (
        connectionRequests.map((connectionReq) => (
          <div
            key={connectionReq.recipient.email}
            className="flex justify-between items-end p-3 rounded-md shadow-md my-3 relative bg-slate-100"
          >
            <button
              onClick={() => confirmCancel(connectionReq.recipient.email)}
              className="absolute px-3 py-2 text-xs top-0 right-0 rounded-md shadow-md bg-red-300 font-semibold"
            >
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
    </dir>
  );
};

export default ConnectionRequests;
