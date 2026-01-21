import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const FaceScan = ({ rollNo, onResult, autoScan = false }) => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Automatically start capturing in autoScan mode
  useEffect(() => {
    if (autoScan && rollNo) {
      setIsCapturing(true);
      console.log(autoScan, rollNo);
    }
    console.log(autoScan, rollNo);
  }, [autoScan, rollNo]);

  useEffect(() => {
    if (!isCapturing) return;
    let intervalId = setInterval(async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;
      try {
        setLoading(true);
        const blob = await (await fetch(imageSrc)).blob();
        const formData = new FormData();
        formData.append("roll_no", rollNo);
        formData.append("image", blob, "face.jpg");
        const response = await fetch("http://127.0.0.1:8000/attendance/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        // Success -> stop scanning and report
        if (data.message && data.message.startsWith("Attendance marked")) {
          setIsCapturing(false);
          onResult({
            success: true,
            name: data.message.split("for ")[1],
            rollNo,
          });
        }
        // Already marked -> stop scanning and report
        else if (
          data.message &&
          data.message.startsWith("Attendance already marked")
        ) {
          setIsCapturing(false);
          onResult({
            success: false,
            error: data.message,
          });
        }
        // No face detected -> keep scanning (transient)
        else if (data.error === "No face detected in image") {
          // intentionally do nothing so scanning continues
        }
        // Other responses -> in autoScan mode keep scanning, otherwise stop and report
        else {
          if (!autoScan) {
            setIsCapturing(false);
            onResult({
              success: false,
              error: data.error || data.message,
            });
          } else {
            // Log and continue scanning in auto mode
            console.warn("FaceScan (auto): non-fatal response:", data);
          }
        }
      } catch (err) {
        // Network errors: in non-auto mode report and stop; in auto mode, log and continue
        if (!autoScan) {
          setIsCapturing(false);
          onResult({
            success: false,
            error: "Network error",
          });
        } else {
          console.warn("FaceScan (auto) network error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isCapturing, rollNo, onResult, autoScan]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-lg font-semibold">
        Scan Face for Roll No: <span className="font-mono">{rollNo}</span>
      </h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={{ facingMode: "user" }}
        className="rounded-lg shadow mb-4"
      />
      {/* Only show button if NOT autoScan */}
      {!isCapturing && !autoScan && (
        <button
          className="btn btn-primary mb-4"
          onClick={() => setIsCapturing(true)}
        >
          Start Face Scan
        </button>
      )}
      {loading && <p className="text-blue-500">Scanning face...</p>}
    </div>
  );
};

export default FaceScan;
