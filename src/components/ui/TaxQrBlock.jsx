import QRCode from 'qrcode.react';

export default function TaxQrBlock({ data }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <QRCode value={data} size={120} />
    </div>
  );
}

