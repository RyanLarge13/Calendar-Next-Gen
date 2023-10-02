import React, { useEffect, useRef } from "react";
import jsQR from "jsqr";

const QRCodeScanner = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Check if the device supports mediaDevices.getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("getUserMedia is not supported on this device");
        }

        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        // Start playing the video
        videoRef.current.play();

        // Continuously capture frames from the camera feed and attempt to decode QR codes
        const captureFrame = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );

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
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline />
      {/* You can add a component or element to display the decoded QR code data */}
    </div>
  );
};

export default QRCodeScanner;
