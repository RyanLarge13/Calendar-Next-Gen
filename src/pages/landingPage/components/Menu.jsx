import { useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";

const Menu = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        className={`fixed z-[950] top-5 right-5 text-2xl ${show ? "text-black" : "text-white"}`} 
        onClick={() => show ? setShow(false) : setShow(true)}
      >
        <BiMenuAltRight />
      </button>
      {show && (
        <>
          <div
            className="z-[850] fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setShow(false)}
          ></div>
          <nav className="fixed top-0 right-0 bottom-0 left-40 bg-white z-[900] p-5">
            <ul>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
              <li>
                <a href="#events">Events</a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
};

export default Menu;
