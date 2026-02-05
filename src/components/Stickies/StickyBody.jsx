import { useContext } from "react";
import ReactQuill from "react-quill";
import { tailwindBgToHex } from "../utils/helpers.js";
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
    <div
      className={`
        ${minimize ? "opacity-0 pointer-events-none" : "opacity-100"}
        absolute inset-0
        px-4 pt-4 pb-16
        overflow-y-auto overflow-x-hidden scrollbar-hide
      `}
    >
      <div className="space-y-3">
        {/* Title */}
        <input
          defaultValue={sticky.title}
          className={`
            w-full bg-transparent
            text-2xl font-semibold tracking-tight
            outline-none
            border-b pb-2
            ${preferences.darkMode ? "border-white/10 text-white placeholder:text-white/50" : "border-black/10 text-slate-900 placeholder:text-slate-400"}
          `}
          style={{ caretColor: tailwindBgToHex(sticky.color) }}
          placeholder="Title…"
        />

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
            className="h-full scrollbar-slick"
          />
        </div>
      </div>
    </div>
  );
};

export default StickyBody;
