import { useParams } from "react-router-dom";

export default function OrderDetailsPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>تفاصيل الطلب #{id}</h2>
    </div>
  );
}