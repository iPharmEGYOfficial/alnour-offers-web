import { QRCodeSVG } from "qrcode.react";

export default function TaxQrBlock({ data, caption = "QR ضريبي" }) {
  if (!data) return null;

  return (
    <div className="qr-section no-break">
      <div className="qr-frame">
        <QRCodeSVG
          value={data}
          size={170}
          level="H"
          includeMargin={true}
        />
      </div>
      <div className="qr-caption">{caption}</div>
    </div>
  );
}
