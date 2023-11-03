import { useContext } from "react";
import UserContext from "../context/UserContext";

const Kanbans = () => {
  const { kanbans } = useContext(UserContext);
  
  const openModalAndSetType = () => {
  	
  }

  return (
    <div>
      {kanbans.length > 0 ? kanbans.map((kanban) => <div></div>) 
      :      
      <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">Create a new project</h2>
            </div>
            <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
            </div>
          </div>
      }
    </div>
  );
};

export default Kanbans;
