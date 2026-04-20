import { QRCodeSVG } from "qrcode.react";

export default function TaxQrBlock({ data, caption = "امسح للتحقق الضريبي" }) {
  if (!data) return null;

  return (
    <div className="qr-section no-break">
      <div className="qr-frame">
        <QRCodeSVG value={data} size={150} level="H" includeMargin />
      </div>
      <div className="qr-caption">{caption}</div>
    </div>
  );
}
