import Reace, { useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onCapture, isCapturing }) => {
  const webcamRef = useRef(null);
  
  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) onCapture(imageSrc);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={{ facingMode: "user" }}
        className="rounded shadow"
      />
      
      <button onClick={handleCapture} className="mt-4 btn-primary">
        Capture`
      </button>
    </div>
  );
};