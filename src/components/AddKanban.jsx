import {useState} from "react";

const AddKanban = () => {
	const [title, setTitle] = useState("")
	
  return (
    <div className="p-3">
      <h2>Lets create your new Kanban Board</h2>
      <p>give it a title</p>
      <input type="text" placeholder="Title" value={title} className="p-3 text-center rounded-md shadow-md bg-white" />
    </div>
  );
};

export default AddKanban;
