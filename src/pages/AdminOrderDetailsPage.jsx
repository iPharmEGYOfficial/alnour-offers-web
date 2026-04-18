import { useParams } from "react-router-dom";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  return <div style={{ padding: 20 }}>طلب #{id}</div>;
}