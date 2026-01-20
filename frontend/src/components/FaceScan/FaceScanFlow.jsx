import React, { useState } from "react";
import QRScanner from "../QR/QRScanner";
import HomePage from "../../pages/HomePage";
import ManualRollInput from "../QR/ManualRollInput";


const FaceScanFlow = () => {
  const [step, setStep] = useState("choose");
  const [rollNo, setRollNo] = useState("");
  // const [result, setResult] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  
  // if (isAdmin) return <HomePage />
  
  return (
    <div>
      <button className="absolute top-2 right-2 btn btn-danger" onClick={() => setShowPinModal(true)}>Exit</button>
      {showPinModal && <AdminPinModal onSuccess={() => setIsAdmin(true)} onClose={() => setShowPinModal(false)} />}
      {step === "choose" && (
        <div className="flex flex-col items-center">
          <h2> Choose Roll No Input Method</h2>
          <button onClick={() => setStep("qr")} className="btn btn-primary my-2" > Scan QR Code</button>
          <button onClick={() => setStep("manual")} className="btn btn-secondary my-2" > Enter Roll No Manually</button>
        </div>
      )}
      <h2> Choose Roll No: {rollNo}</h2>
      {step === "qr" && <QRScanner onScan={data => { if (data) { setRollNo(data); setStep("face"); } }} />}
      {step === "manual" && <ManualRollInput onSubmit={roll => { setRollNo(roll); setStep("face"); }} />}
      {/* {step === "face" && <WebcanCapture onCapture={ } isCapturing={true} />}*/}
      {/* {result && <AttendanceResult result={result} onStartOver={ } onRescanFace={ } onRescanQR={ } onRenterRoll={ } />}*/}
    </div>
  );
};

export default FaceScanFlow;
