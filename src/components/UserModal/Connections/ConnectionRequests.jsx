import { useContext } from "react";
import UserContext from "../../../context/UserContext";
import { cancelAFriendRequest } from "../../../utils/api";

const ConnectionRequests = () => {
  const {
    connectionRequests,
    setConnectionRequests,
    setSystemNotif,
    preferences,
  } = useContext(UserContext);

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
            (req) => req.email !== recipientsEmail,
          );
          setConnectionRequests(filteredRequests);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          Connection Requests
        </h3>
      </div>

      {connectionRequests.length > 0 ? (
        <div className="space-y-3">
          {connectionRequests.map((connectionReq) => (
            <div
              key={connectionReq.recipient.email}
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
                    src={connectionReq.recipient.avatarUrl}
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
                      {connectionReq.recipient.username}
                    </p>
                    <p
                      className={`text-[11px] mt-1 font-semibold truncate ${
                        preferences.darkMode
                          ? "text-white/50"
                          : "text-slate-500"
                      }`}
                    >
                      <a
                        href={`mailto:${connectionReq.recipient.email}`}
                        className="hover:underline"
                      >
                        {connectionReq.recipient.email}
                      </a>
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

              {/* Meta / status row */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <p
                  className={`text-[11px] font-semibold ${
                    preferences.darkMode ? "text-white/45" : "text-slate-500"
                  }`}
                >
                  Waiting for recipient to accept your request
                </p>

                <button
                  onClick={() => confirmCancel(connectionReq.recipient.email)}
                  className={`
                px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-rose-500/15 border-rose-300/20 text-rose-100 hover:bg-rose-500/20"
                    : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                }
              `}
                  type="button"
                >
                  Cancel Request
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
          <p className="text-sm font-semibold">No connection requests sent</p>
          <p
            className={`text-[11px] mt-1 font-semibold ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            You don’t currently have any pending outgoing connection requests.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests;
