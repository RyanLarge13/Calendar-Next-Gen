import React from "react";

const AddReminder = () => {
  return (
    <div className="p-2 pt-10">
      <h2 className="text-center">Create A New Reminder</h2>
      <form className="mt-10 w-full">
        <input
          placeholder="New Reminder"
          className="p-2 rounded-md shadow-sm shadow-slate-300 w-full"
        />
      </form>
      <div className="justify-between items-center">
        <button></button>
      </div>
    </div>
  );
};

export default AddReminder;
