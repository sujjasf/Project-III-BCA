import React, { useState } from "react";
import QRScanner from "../components/QR/QRScanner";
import FaceScanFlow from "../components/FaceScan/FaceScanFlow";
import ManualRollInput from "../components/QR/ManualRollInput";
import { Suspense } from "react";
import { useCallback } from "react";


// Lazy load FaceScanFlow for performance (only load when needed)
// const FaceScanFlow = lazy(() => import("../components/FaceScan/FaceScanFlow"));

const AttendancePage = () => {
  const [step, setStep] = useState("choose");
  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState(null);
  
  const handleChoose = useCallback((method) => setStep(method), []);
  const handleQRScan = useCallback((data) => {
    if (data) {
      setRollNo(data);
      setStep("face");
    }
  }, []);
  const handleManualSubmit = useCallback((roll) => {
    setRollNo(roll);
    setStep("face");
  }, []);
  const handleFaceScanResult = useCallback((scanResult) => {
    setResult(scanResult);
    setStep("result");
  }, []);
  const handleStartOver = useCallback(() => {
    setStep("choose");
    setRollNo("");
    setResult(null);
  }, []);
  
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {step === "choose" && (
          <ChooseMethod onChoose={handleChoose} />
        )}
        {step === "qr" && (
          <QRScanner onChoose={handleQRScan} />
        )}
        {step === "manual" && (
          <ManualRollInput onChoose={handleManualSubmit} />
        )}
        {step === "face" && (
          <Suspense fallback={<div>Loading Face Scanner...</div>}>
            <FaceScanFlow rollNo={rollNo} onChoose={handleFaceScanResult} />
          </Suspense>
        )}
        {step === "result" && (
          <AttendanceResult result={result} onChoose={handleStartOver} />
        )}        
      </div>
    </div>
  );
};

export default AttendancePage;