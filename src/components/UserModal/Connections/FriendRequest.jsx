import { useContext } from "react";
import { acceptFriendRequest } from "../../../utils/api";
import UserContext from "../../../context/UserContext";

const FriendRequest = () => {
  const { friendRequests, setSystemNotif, preferences } =
    useContext(UserContext);

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
    <div className="mt-5">
      {/* Section Header */}
      <div className="mb-3">
        <p
          className={`text-[11px] font-semibold ${
            preferences.darkMode ? "text-white/45" : "text-slate-500"
          }`}
        >
          Social
        </p>
        <h3 className="text-lg font-semibold tracking-tight">
          Friend Requests
        </h3>
      </div>

      {friendRequests.length > 0 ? (
        <div className="space-y-3">
          {friendRequests.map((friendReq) => (
            <div
              key={friendReq.sender.email}
              className={`
            rounded-3xl border shadow-sm p-4
            transition-all duration-200
            hover:shadow-md hover:scale-[1.01]
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white border-black/10"
            }
          `}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={friendReq.sender.avatarUrl}
                    alt="users avatar"
                    className={`
                  w-12 h-12 rounded-full shadow-sm object-cover border
                  ${
                    preferences.darkMode ? "border-white/10" : "border-black/10"
                  }
                `}
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {friendReq.sender.username}
                    </p>
                    <p
                      className={`text-[11px] mt-1 font-semibold truncate ${
                        preferences.darkMode
                          ? "text-white/50"
                          : "text-slate-500"
                      }`}
                    >
                      {friendReq.sender.email}
                    </p>
                  </div>
                </div>

                <div
                  className={`
                flex-shrink-0 px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
                ${
                  preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700"
                }
              `}
                >
                  Pending
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-between items-center gap-3">
                <button
                  className={`
                flex-1 px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-rose-500/15 border-rose-300/20 text-rose-100 hover:bg-rose-500/20"
                    : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                }
              `}
                  type="button"
                >
                  Deny
                </button>

                <button
                  onClick={() => confirmAccept(friendReq.sender.email)}
                  className={`
                flex-1 px-4 py-2 rounded-2xl text-xs font-semibold text-white shadow-md transition active:scale-[0.97]
                bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
              `}
                  type="button"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`
        rounded-3xl border shadow-sm p-5
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10"
            : "bg-white border-black/10"
        }
      `}
        >
          <p className="text-sm font-semibold">No new friend requests</p>
          <p
            className={`text-[11px] mt-1 font-semibold ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            You’re all caught up for now.
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
