import { useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>تفاصيل المنتج {id}</h2>
    </div>
  );
}