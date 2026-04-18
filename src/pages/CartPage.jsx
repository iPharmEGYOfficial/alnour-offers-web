import useCartStore from "../store/cartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  if (!items.length) {
    return <div style={{ padding: 20 }}>السلة فارغة</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>سلة المشتريات</h2>

      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          {item.productName} × {item.qty}
        </div>
      ))}
    </div>
  );
}