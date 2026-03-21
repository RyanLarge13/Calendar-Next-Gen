import { useContext, useState } from "react";
import { AiOutlineMail, AiOutlineQrcode } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import { motion } from "framer-motion";
import UserContext from "../../../context/UserContext";

const Friends = () => {
  const { friends, qrCodeUrl, preferences } = useContext(UserContext);

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
        <div className="space-y-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className={`
            rounded-3xl border shadow-sm p-4
            flex items-center justify-between gap-3
            transition-all duration-200
            hover:shadow-md hover:scale-[1.01]
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white border-black/10"
            }
          `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={friend.friendAvatar}
                  alt="user"
                  className={`
                w-11 h-11 rounded-full shadow-sm object-cover border
                ${preferences.darkMode ? "border-white/10" : "border-black/10"}
              `}
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {friend.friendEmail}
                  </p>
                  <p
                    className={`text-[11px] mt-1 font-semibold ${
                      preferences.darkMode ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    Connected friend
                  </p>
                </div>
              </div>

              <div
                className={`
              px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold flex-shrink-0
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 text-slate-600"
              }
            `}
              >
                Friend
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`
        rounded-3xl border shadow-2xl p-5
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10"
            : "bg-white border-black/10"
        }
      `}
        >
          {/* Empty state header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-[11px] font-semibold ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                Friends
              </p>
              <h3 className="text-lg font-semibold tracking-tight mt-1">
                No connections yet
              </h3>
              <p
                className={`text-sm mt-2 ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Start a new connection by sharing a QR code or inviting by
                email.
              </p>
            </div>

            <div
              className={`
            grid place-items-center h-12 w-12 rounded-2xl border shadow-sm flex-shrink-0
            ${
              preferences.darkMode
                ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                : "bg-cyan-50 border-cyan-200 text-cyan-700"
            }
          `}
            >
              <IoIosAddCircle className="text-2xl" />
            </div>
          </div>

          {/* Main CTA */}
          <div className="mt-5">
            <button
              type="button"
              className={`
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-2xl shadow-md text-sm font-semibold text-white
            transition active:scale-[0.97]
            bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
          `}
              onClick={() => setPick(true)}
            >
              Create Connection
              <IoIosAddCircle className="text-lg" />
            </button>
          </div>

          {/* Method picker */}
          {pick && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEmailAdd(false);
                    setQrOptions(true);
                  }}
                  className={`
                flex-1 min-w-[120px]
                px-4 py-3 rounded-2xl border shadow-sm
                flex items-center justify-center gap-2 text-sm font-semibold
                transition active:scale-[0.97]
                ${
                  qrOptions
                    ? preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/75 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-700 hover:bg-black/[0.06]"
                }
              `}
                >
                  <AiOutlineQrcode className="text-lg" />
                  QR Code
                </button>

                <button
                  onClick={() => {
                    setQrOptions(false);
                    setEmailAdd(true);
                  }}
                  className={`
                flex-1 min-w-[120px]
                px-4 py-3 rounded-2xl border shadow-sm
                flex items-center justify-center gap-2 text-sm font-semibold
                transition active:scale-[0.97]
                ${
                  emailAdd
                    ? preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/75 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-700 hover:bg-black/[0.06]"
                }
              `}
                >
                  <AiOutlineMail className="text-lg" />
                  Email
                </button>
              </div>
            </motion.div>
          )}

          {/* QR section */}
          {qrOptions && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
            mt-4 rounded-3xl border shadow-sm p-4
            flex flex-col justify-center items-center
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10"
                : "bg-black/[0.02] border-black/10"
            }
          `}
            >
              <img
                src={qrCodeUrl}
                alt="user qr code"
                className={`
              w-40 h-40 rounded-2xl shadow-sm object-cover border
              ${preferences.darkMode ? "border-white/10 bg-white" : "border-black/10 bg-white"}
            `}
              />

              <button
                onClick={() =>
                  openCamera ? setOpenCamera(false) : setOpenCamera(true)
                }
                className={`
              mt-5 px-4 py-2 rounded-2xl border shadow-sm text-sm font-semibold transition active:scale-[0.97]
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/75 hover:bg-white/10"
                  : "bg-white border-black/10 text-slate-700 hover:bg-black/[0.03]"
              }
            `}
              >
                {openCamera ? "Cancel" : "Or Scan Your Friend!"}
              </button>

              {/* {openCamera ? <QRCodeScanner /> : null} */}
            </motion.div>
          )}

          {/* Email section */}
          {emailAdd && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
            mt-4 rounded-3xl border shadow-sm p-4
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10"
                : "bg-black/[0.02] border-black/10"
            }
          `}
            >
              <form onSubmit={(e) => addFriendByEmail(e)} className="w-full">
                <label className="block">
                  <p
                    className={`text-[11px] font-semibold mb-2 ${
                      preferences.darkMode ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    Invite by email
                  </p>

                  <input
                    placeholder="User’s email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                  w-full px-4 py-3 rounded-2xl border shadow-inner outline-none text-sm font-semibold
                  ${
                    preferences.darkMode
                      ? "bg-[#161616]/40 border-white/10 text-white placeholder:text-white/35 focus:bg-[#161616]/55"
                      : "bg-white border-black/10 text-slate-900 placeholder:text-slate-400 focus:bg-black/[0.02]"
                  }
                `}
                  />
                </label>
              </form>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
