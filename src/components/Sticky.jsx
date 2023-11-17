import { useState, useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import {
  AiFillPushpin,
  AiFillCloseCircle,
  AiOutlinePushpin,
} from "react-icons/ai";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { FaRegWindowMinimize } from "react-icons/fa";
import { FiMaximize } from "react-icons/fi";

const Sticky = ({ sticky }) => {
  const [expand, setExpand] = useState(false);
  const [pin, setPin] = useState(sticky.pin);
  const [fullScreen, setFullScreen] = useState(false);
  const [minimize, setMinimize] = useState(true);
  //  const [constraintRight, setConstraintRight] = useState(
  //  window.innerWidth - 200
  // );
  //  const [constraintBottom, setConstraintBottom] = useState(
  //   window.innerWidth - 200
  //  );

  const stickyRef = useRef(null);

  const controls = useDragControls();

  //   useEffect(() => {
  //     if (stickyRef.current) {
  //       const elemWidth = stickyRef.current.clientWidth;
  //       const elemHeight = stickyRef.current.clientHeight;
  //       const right = window.innerWidth - elemWidth;
  //       const bottom = window.innerHeight - elemHeight;
  //       setConstraintRight(right);
  //       setConstraintBottom(bottom);
  //     }
  //   }, [minimize, expand, fullScreen]);

  const startDrag = (e) => {
    controls.start(e);
  };

  const getLeft = () => {
    if (stickyRef.current) {
      const left = stickyRef.current.getBoundingClientRect().left;
      return -left;
    }
  };

  const getTop = () => {
    if (stickyRef.current) {
      const left = stickyRef.current.getBoundingClientRect().top;
      return -left;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      exit={{ scale: 0 }}
      animate={
        !minimize
          ? expand
            ? fullScreen
              ? {
                  height: window.innerHeight,
                  top: getTop(),
                  left: getLeft(),
                  width: window.innerWidth,
                  scale: 1,
                }
              : { scale: 1, height: 500, width: 250 }
            : { scale: 1, height: 175, width: 175 }
          : {
              scale: 1,
              height: 150,
              width: 8,
              overflow: "hidden",
              left:getLeft()
            }
      }
      drag={fullScreen ? false : !!minimize ? "y" : !pin}
      dragControls={controls}
      dragListener={false}
      dragConstraints={{
        top: 0,
        right: window.innerWidth - 200,
        left: 0,
        bottom: window.innerHeight - 200,
      }}
      ref={stickyRef}
      className={`markdown z-[999] shadow-xl rounded-md fixed ${sticky.color}`}
      onClick={() => {
        if (!!minimize) {
          if ("vibrate" in navigator) {
            navigator.vibrate(75);
          }
          setMinimize(false);
        }
      }}
    >
      <div
        className="rounded-t-md bg-slate-100 shadow-md p-2 flex justify-between items-center"
        onPointerDown={startDrag}
        style={{ touchAction: "none" }}
      >
        <div className="flex justify-between items-center gap-x-3">
          <button onClick={() => setPin((prev) => !prev)}>
            {!!pin ? <AiFillPushpin /> : <AiOutlinePushpin />}
          </button>
          <button onClick={() => setExpand((prev) => !prev)}>
            {!!expand ? <BiCollapse /> : <BiExpand />}
          </button>
        </div>
        <div>
          <AiFillCloseCircle />
        </div>
      </div>
      {!!expand && (
        <div className="rounded-b-md bg-slate-100 shadow-md p-2 flex justify-between items-center">
          <button onClick={() => setFullScreen((prev) => !prev)}>
            <FiMaximize />
          </button>
          <button onClick={() => setMinimize(true)}>
            <FaRegWindowMinimize />
          </button>
        </div>
      )}
      <div
        className={`${
          !!expand ? "mt-20" : "mt-5"
        } p-2 overflow-y-auto absolute inset-0 z-[-1]`}
      >
        <h2>{sticky.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: sticky.body }}></div>
      </div>
    </motion.div>
  );
};

export default Sticky;
