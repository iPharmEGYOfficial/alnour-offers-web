import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [phoneNumber, setPhoneNumber] = useState("535272372");
  const [passwordPin, setPasswordPin] = useState("26222");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(phoneNumber, passwordPin);
      setUser(data);
      navigate("/offers");
    } catch (err) {
      setError(err?.response?.data?.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>تسجيل الدخول</h1>
        <p className="subtle">أدخل رقم الهاتف والرقم السري</p>

        <label>رقم الهاتف</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="535272372"
        />

        <label>الرقم السري</label>
        <input
          type="password"
          value={passwordPin}
          onChange={(e) => setPasswordPin(e.target.value)}
          placeholder="26222"
        />

        {error && <div className="error-box">{error}</div>}

        <button className="primary-btn full" disabled={loading}>
          {loading ? "جار تسجيل الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}