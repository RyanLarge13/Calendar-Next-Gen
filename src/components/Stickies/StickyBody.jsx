import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import UserContext from "../../context/UserContext";
import { updateSticky } from "../../utils/api.js";

const StickyBody = ({ sticky, minimize = false }) => {
  const { preferences } = useContext(UserContext);

  const [editText, setEditText] = useState(sticky.body);
  const [initialText, setInitialText] = useState(sticky.body);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }], // Color and Background buttons
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "clean",
  ];

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [editText]);

  const handleTextChange = (value) => {
    setEditText(value);
  };

  const handleSave = async () => {
    if (initialText === editText) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await updateSticky(token, sticky.id, editText);

      setInitialText(editText);
    } catch (err) {
      console.log(`Error from server saving sticky note. Error: ${err}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Editor container */}
      <div
        className={`
            rounded-2xl border shadow-sm overflow-hidden
            ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}
          `}
      >
        <ReactQuill
          modules={modules}
          formats={formats}
          value={editText}
          onBlur={handleSave}
          onChange={handleTextChange}
          className="h-full scrollbar-slick p-5"
        />
      </div>
    </div>
  );
};

export default StickyBody;
