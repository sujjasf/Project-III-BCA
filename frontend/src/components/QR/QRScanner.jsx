import React from "react";
import QrReader from "react-qr-reader";

const QRScanner = ({ onScan, onError, style }) => {
  return (
    <div style={{ ...defaultStyle, ...style }} >
      <h2>Scan QR Code</h2>
      <QrReader
        delay={200}
        onError={onError}
        onScan={onScan}
        style={{ width: "100%" }}
      />
      <p>Align the QR code within the frame.</p>
    </div>
  );
};

const defaultStyle = {
  maxWidth: 400,
  margin: "0 auto",
  padding: 20,
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
};

export default QRScanner;