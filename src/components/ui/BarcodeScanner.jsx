import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        onScan(decodedText);
        scanner.stop();
      },
      () => {}
    );

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div style={overlay}>
      <div style={box}>
        <div id="reader" style={{ width: "300px" }} />
        <button onClick={onClose} style={btn}>إغلاق</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100
};

const box = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center"
};

const btn = {
  marginTop: "10px",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};