import { useContext } from "react";
import { BiListPlus, BiPin, BiShareAlt, BiTrash } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import Masonry from "react-masonry-css";
import UserContext from "../../context/UserContext.jsx";
import { getAuthToken, tailwindBgToHex } from "../../utils/helpers.js";
import StickyBody from "./StickyBody.jsx";
import { API_UpdateStickyPin, deleteStickyNote } from "../../utils/api.js";

const StaticStickies = () => {
  const { stickies, preferences, setStickies, setSystemNotif } =
    useContext(UserContext);

  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1800: 3,
    1400: 2, // Number of columns on screens > 1100px
    1000: 1,
  };

  const openModalAndSetType = () => {};

  const confirmDelete = (stickyId) => {
    const newConfirmation = {
      show: true,
      title: "Delete sticky",
      text: "Are you sure you want to delete this sticky note?",
      color: "bg-red-200",
      hasCancel: true,
      actions: [
        { text: "close", func: () => setSystemNotif({ show: false }) },
        { text: "delete", func: () => deleteSticky(stickyId) },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteSticky = (stickyId) => {
    setSystemNotif({ show: false });
    const token = localStorage.getItem("authToken");
    if (!token) {
    }
    if (token) {
      deleteStickyNote(token, stickyId)
        .then((res) => {
          const newStickies = stickies.filter((item) => item.id !== stickyId);
          setStickies(newStickies);
          const newSuccess = {
            show: true,
            title: "Deleted Sticky",
            text: "Successfully deleted your sticky note",
            color: "bg-green-200",
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const togglePin = async (newPin, stickyId) => {
    const oldStickies = stickies;

    setStickies((prev) =>
      prev.map((s) => {
        if (s.id === stickyId) {
          return {
            ...s,
            pin: newPin,
          };
        }
        return s;
      }),
    );

    try {
      const token = getAuthToken();
      await API_UpdateStickyPin(newPin, stickyId, token);
    } catch (err) {
      setStickies(oldStickies);
      console.log("Error updating sticky pin value on server");
      console.log(err);
    }
  };

  return stickies.length > 0 ? (
    <div className="px-3 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {stickies.map((sticky) => (
            <div
              key={sticky.id}
              className={`
            relative overflow-hidden
            rounded-3xl border shadow-sm transition-all duration-200
            ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
            my-4
          `}
            >
              {/* Accent strip */}
              <div
                className={`${sticky.color} absolute left-0 top-0 bottom-0 w-2`}
              />

              {/* Header */}
              <div
                className={`
              px-5 pt-5 pb-4 pl-7
              border-b
              ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            `}
              >
                {/* Title */}
                <div>
                  <input
                    defaultValue={sticky.title}
                    className={`
                            w-full bg-transparent
                            text-lg font-semibold tracking-tight
                            outline-none
                            border-b pb-2 mb-1
                            ${preferences.darkMode ? "border-white/10 text-white placeholder:text-white/50" : "border-black/10 text-slate-900 placeholder:text-slate-400"}
                          `}
                    style={{ caretColor: tailwindBgToHex(sticky.color) }}
                    placeholder="Title…"
                  />
                  <div className="flex justify-start items-center gap-2 mt-1">
                    <button
                      className={`
                        grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
                      `}
                      onClick={() => confirmDelete(sticky.id)}
                    >
                      <BiTrash />
                    </button>
                    <button
                      className={`
                        grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
                      `}
                    >
                      <BiShareAlt />
                    </button>
                    <button
                      onClick={() => togglePin(!sticky.pin, sticky.id)}
                      className={`
                        grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
                      `}
                    >
                      <BiPin
                        className={`${sticky.pin ? "text-cyan-800" : ""} duration-200`}
                      />
                    </button>
                  </div>
                </div>
                <p
                  className={`text-xs mt-2 ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
                >
                  Sticky note
                </p>
              </div>

              {/* Body */}
              <StickyBody sticky={sticky} />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  ) : (
    <button className="px-3">
      <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
        <div>
          <h2 className="font-semibold mb-2">You have no sticky notes</h2>
          <BiListPlus />
        </div>
        <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
          <IoIosAddCircle />
        </div>
      </div>
    </button>
  );
};

export default StaticStickies;
