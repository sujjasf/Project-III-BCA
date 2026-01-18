import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import QrReader from "react-qr-reader";

const API_URL = "http://127.0.0.1:8000/attendance/";

const FaceScanFlow = () => {
  const [step, setStep] = useState("choose");
  const [rollNo, setRollNo] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [result, setResult] = useState(null);
  const webcamRef = useRef(null);

  // For continuous capture
  const [isCapturing, setIsCapturing] = useState(false);
  const processingRef = useRef(false); // avoid race conditions

  // Step 1: Scan QR
  const handleScan = (data) => {
    if (data) {
      setRollNo(data);
      setStep("face");
    }
  };

  // Step 2: Manual entry
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setRollNo(manualInput.trim());
      setStep("face");
    }
  };

  // Step 3: Continuous Face Scan
  useEffect(() => {
    let intervalId;
    if (step === "face") {
      setIsCapturing(true);
      processingRef.current = false;
      intervalId = setInterval(async () => {
        if (
          webcamRef.current &&
          !processingRef.current &&
          isCapturing &&
          rollNo
        ) {
          processingRef.current = true;
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) {
            processingRef.current = false;
            return;
          }
          try {
            const blob = await (await fetch(imageSrc)).blob();
            const formData = new FormData();
            formData.append("roll_no", rollNo);
            formData.append("image", blob, "face.jpg");
            const response = await fetch(API_URL, {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            if (data.message && data.message.startsWith("Attendance marked")) {
              setResult({
                success: true,
                name: data.message.split("for ")[1],
                rollNo,
              });
              setIsCapturing(false);
            } else if (data.error === "No face detected in image") {
              // No face, keep scanning
              processingRef.current = false;
            } else {
              setResult({
                success: false,
                error: data.error || data.message,
              });
              setIsCapturing(false);
            }
          } catch (err) {
            setResult({ success: false, error: "Network error" });
            setIsCapturing(false);
          }
        }
      }, 500);
    }
    return () => {
      setIsCapturing(false);
      processingRef.current = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, rollNo, isCapturing]);

  return (
    <div>
      {step === "choose" && (
        <div>
          <h2>Choose Roll No Input Method</h2>
          <button onClick={() => setStep("qr")}>Scan QR Code</button>
          <button onClick={() => setStep("manual")}>
            Enter Roll No Manually
          </button>
        </div>
      )}
      {step === "qr" && (
        <div>
          <h2>Scan QR Code</h2>
          <QrReader
            delay={100}
            onError={console.error}
            onScan={(data) => {
              if (data) handleScan(data);
            }}
            style={{ width: "500px" }}
          />
          <button onClick={() => setStep("choose")}>Back</button>
        </div>
      )}
      {step === "manual" && (
        <form onSubmit={handleManualSubmit}>
          <h2>Enter Roll No</h2>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Roll No"
            required
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setStep("choose")}>
            Back
          </button>
        </form>
      )}
      {step === "face" && (
        <div>
          <h2>Scan Face for Roll No: {rollNo}</h2>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
            videoConstraints={{ facingMode: "user" }}
          />
          <br />
          <p>
            {isCapturing
              ? "Scanning for face... Please look at the camera."
              : "Stopped."}
          </p>
        </div>
      )}
      {result && (
        <div>
          {result.success ? (
            <div>
              <h3>Face scan success!</h3>
              <p>Name: {result.name}</p>
              <p>Roll No: {result.rollNo}</p>
              <button
                onClick={() => {
                  setResult(null);
                  setStep("choose");
                  setRollNo("");
                }}
              >
                Start Over
              </button>
            </div>
          ) : (
            <div>
              <h3>Face scan failed!</h3>
              <p>{result.error}</p>
              <button
                onClick={() => {
                  setResult(null);
                  setStep("face");
                  setIsCapturing(true);
                }}
              >
                Rescan Face
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setStep("qr");
                  setRollNo("");
                }}
              >
                Rescan QR
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setStep("manual");
                  setRollNo("");
                }}
              >
                Re-enter Roll No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceScanFlow;
