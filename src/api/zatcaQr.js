function toTLV(tag, value) {
  const textEncoder = new TextEncoder();
  const valueBytes = textEncoder.encode(value);

  return new Uint8Array([
    tag,
    valueBytes.length,
    ...valueBytes
  ]);
}

export function generateZatcaQR({
  seller,
  vat,
  timestamp,
  total,
  vatTotal
}) {
  const tlv = [
    ...toTLV(1, seller),
    ...toTLV(2, vat),
    ...toTLV(3, timestamp),
    ...toTLV(4, total.toString()),
    ...toTLV(5, vatTotal.toString())
  ];

  return btoa(String.fromCharCode(...tlv));
}

