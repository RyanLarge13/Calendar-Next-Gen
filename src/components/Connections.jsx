import { useState, useContext, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosAddCircle } from "react-icons/io";
import {
  AiOutlineMail,
  AiOutlineQrcode,
  AiOutlineArrowDown,
} from "react-icons/ai";
import jsQR from "jsqr";
import UserContext from "../context/UserContext";

const Connections = ({ setOption }) => {
  const { user, friends, setFriends, qrCodeUrl } = useContext(UserContext);

  const [pick, setPick] = useState(false);
  const [qrOptions, setQrOptions] = useState(false);
  const [emailAdd, setEmailAdd] = useState(false);
  const [email, setEmail] = useState("");
  const [openCamera, setOpenCamera] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    return () => videoRef.current.stop();
  }, []);

  const finish = (e, info) => {
    const dragDistance = info.offset.y;
    const cancelThreshold = 175;

    if (dragDistance > cancelThreshold) {
      setOption(null);
    }
    if (dragDistance < cancelThreshold) {
      return;
    }
  };

  const addFriendByEmail = (e) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      // Check if the device supports mediaDevices.getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported on this device");
      }
      setOpenCamera(true);
      // Request access to the camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      // Start playing the video
      videoRef.current.play();

      // Continuously capture frames from the camera feed and attempt to decode QR codes
      const captureFrame = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Attempt to decode QR code from the captured frame
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log("QR Code data:", code.data);

          // Stop capturing frames and close the camera stream
          stream.getTracks().forEach((track) => track.stop());
        } else {
          // If no QR code is detected, continue capturing frames
          requestAnimationFrame(captureFrame);
        }
      };

      // Start capturing frames
      requestAnimationFrame(captureFrame);
    } catch (error) {
      setOpenCamera(false);
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0 }}
      dragSnapToOrigin={true}
      onDragEnd={finish}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-white z-50 p-5 overflow-y-auto scrollbar-hide"
    >
      <div className="relative">
        <h2 className="text-4xl pb-2 border-b">Connections</h2>
        <div
          onClick={() => setOption(null)}
          className="absolute top-0 bottom-0 right-0 text-lg"
        >
          <AiOutlineArrowDown />
        </div>
      </div>
      <div className="mt-5">
        <p>Your Friends</p>
        <div className="mt-3">
          {friends.length > 0 ? (
            friends.map((friend) => <div></div>)
          ) : (
            <div className="p-5 flex flex-col justify-center items-center bg-cyan-100 shadow-md rounded-md">
              <p>No friends</p>
              <button
                type="button"
                className="flex flex-col justify-center items-center mt-3 py-1 px-3 rounded-md shadow-md bg-white"
                onClick={() => setPick(true)}
              >
                <p>Create Connection</p>
                <IoIosAddCircle />
              </button>
              {pick && (
                <motion.div className="my-3 flex justify-center items-center">
                  <button
                    onClick={() => {
                      setEmailAdd(false);
                      setQrOptions(true);
                    }}
                    className="px-3 py-2 rounded-md shadow-md mx-3 bg-white text-lg"
                  >
                    <AiOutlineQrcode />
                  </button>
                  <button
                    onClick={() => {
                      setQrOptions(false);
                      setEmailAdd(true);
                    }}
                    className="px-3 py-2 rounded-md shadow-md mx-3 bg-white text-lg"
                  >
                    <AiOutlineMail />
                  </button>
                </motion.div>
              )}
              {qrOptions && (
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={qrCodeUrl}
                    alt="user qr code"
                    className="w-40 h-40 rounded-md shadow-md"
                  />
                  <button
                    onClick={() => startCamera()}
                    className="px-3 py-2 rounded-md shadow-md bg-white mt-5"
                  >
                    Or Scan Your Friends!
                  </button>
                  {openCamera && (
                    <div className="mt-5">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="rounded-md shadow-md"
                      />
                    </div>
                  )}
                </div>
              )}
              {emailAdd && (
                <form
                  onSubmit={(e) => addFriendByEmail(e)}
                  className="w-full px-3"
                >
                  <input
                    placeholder="Users Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-md shadow-md bg-white focus:outline-none w-full"
                  />
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Connections;
