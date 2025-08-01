import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";

// Simple SVG blood drop symbol
const BloodDrop = () => (
  <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0C20 0 0 30 0 42C0 54 9 60 20 60C31 60 40 54 40 42C40 30 20 0 20 0Z" fill="#E53935"/>
  </svg>
);

const DonationCertificate = ({ donorName, units, date, qrValue }) => {
  const certRef = useRef();

  const handleDownload = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.html(certRef.current, {
      callback: function (doc) {
        doc.save("Blood-Donation-Certificate.pdf");
      },
      x: 20,
      y: 20,
      width: 800,
      windowWidth: 900
    });
  };

  return (
    <div style={{ textAlign: "center", margin: "2rem 0" }}>
      <div ref={certRef} style={{
        width: 800,
        margin: "0 auto",
        padding: 32,
        border: "4px solid #E53935",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(229,57,53,0.1)",
        position: "relative"
      }}>
        <BloodDrop />
        <h1 style={{ color: "#E53935", margin: "16px 0 8px" }}>Certificate of Blood Donation</h1>
        <p style={{ fontSize: 18, margin: "8px 0" }}>This is to certify that</p>
        <h2 style={{ color: "#333", margin: "8px 0" }}>{donorName}</h2>
        <p style={{ fontSize: 18, margin: "8px 0" }}>has generously donated</p>
        <h2 style={{ color: "#E53935", margin: "8px 0" }}>{units} unit(s) of blood</h2>
        <p style={{ fontSize: 16, margin: "8px 0" }}>on {date}</p>
        <div style={{ margin: "24px 0" }}>
          <QRCodeCanvas value={qrValue} size={100} />
        </div>
        <p style={{ fontSize: 14, color: "#888" }}>Scan the QR code to verify this donation.</p>
      </div>
      <button onClick={handleDownload} style={{
        marginTop: 24,
        padding: "10px 32px",
        background: "#E53935",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 18,
        cursor: "pointer"
      }}>
        Download Certificate
      </button>
    </div>
  );
};

export default DonationCertificate; 