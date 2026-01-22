import React from "react";
import QrReader from "react-qr-reader";

const QRScanner = ({ onScan, onError }) => {
  return (
    <div >
      <h2>Scan QR Code</h2>
      <QrReader
        delay={20}
        onError={onError}
        onScan={onScan}
        style={{ width: "100%", transform: "scaleX(-1)" }}
      />
      <p>Align the QR code within the frame.</p>
    </div>
  );
};

export default QRScanner;