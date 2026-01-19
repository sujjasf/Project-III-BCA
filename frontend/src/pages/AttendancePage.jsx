import React, { useState } from "react";
import QRScanner from "../components/QR/QRScanner";

const AttendancePage = () => {
  const [rollNo, setRollNo] = useState("");
  
  const handleScan = (data) => {
    if (data) {
      setRollNo(data);
    }
  };
  
  const handleError = (err) => {
    console.error("QR Scan Error: ", err);
  };
  
  return (
    <div>
      <h1 class="text-3xl font-bold underline">
          Hello world!
        </h1>
      {!rollNo ? (
        <QRScanner onScan={handleScan} onError={handleError} />
      ) : (
        <div>Scanned Roll No: {rollNo} </div>
      )}
    </div>
  );
};

export default AttendancePage;