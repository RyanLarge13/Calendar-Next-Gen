import { useState, useCallback } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const AddSticky = () => {
  const [value, setValue] = useState("Write up a fun note!");

  const onChange = useCallback((value) => {
    setValue(value);
  }, []);

  return (
    <div className="p-2 pt-10">
      <h2 className="text-center">Create your new sticky</h2>
      <div className="mt-10">
        <SimpleMDE value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default AddSticky;
