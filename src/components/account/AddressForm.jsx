import { useState } from "react";
import MapPicker from "../maps/MapPicker";

const initialState = {
  label: "",
  fullName: "",
  phone: "",
  country: "المملكة العربية السعودية",
  city: "",
  district: "",
  street: "",
  buildingNo: "",
  floor: "",
  apartment: "",
  notes: "",
  latitude: "",
  longitude: "",
  isDefault: false
};

export default function AddressForm({ onSave, initialValues, onCancel }) {
  const [form, setForm] = useState(initialValues || initialState);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function reverseGeocode(lat, lng) {
    setIsResolvingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`,
        { headers: { Accept: "application/json" } }
      );

      const data = await res.json();
      const addr = data?.address || {};

      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        country: addr.country || prev.country || "المملكة العربية السعودية",
        city: addr.city || addr.town || addr.village || addr.state_district || prev.city,
        district: addr.suburb || addr.neighbourhood || addr.city_district || prev.district,
        street: addr.road || addr.pedestrian || addr.footway || prev.street
      }));
    } catch {
      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng
      }));
      alert("تم تحديد الموقع، لكن تعذر جلب العنوان تلقائيًا.");
    } finally {
      setIsResolvingAddress(false);
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      },
      () => alert("فشل تحديد الموقع"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useMockLocation = async () => {
    setForm((prev) => ({
      ...prev,
      label: prev.label || "المنزل",
      fullName: prev.fullName || "هيثم أسامة عبدالغفار",
      phone: prev.phone || "0535272372",
      buildingNo: prev.buildingNo || "4273",
      floor: prev.floor || "1",
      apartment: prev.apartment || "2",
      notes: prev.notes || "عنوان تجريبي منظم لاختبار التوصيل داخل المشروع."
    }));

    await reverseGeocode(21.9167, 42.85);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.city.trim()) {
      alert("من فضلك أدخل الاسم ورقم الهاتف والمدينة");
      return;
    }

    if (!form.latitude || !form.longitude) {
      alert("من فضلك اختر الموقع من الخريطة أو استخدم تحديد الموقع");
      return;
    }

    onSave(form);
    setForm(initialState);
  };

  return (
    <form className="address-form" onSubmit={submit}>
      <div className="address-form__grid">
        <input value={form.label} onChange={(e) => setValue("label", e.target.value)} placeholder="اسم العنوان (المنزل / العمل)" />
        <input value={form.fullName} onChange={(e) => setValue("fullName", e.target.value)} placeholder="الاسم الكامل" />
        <input value={form.phone} onChange={(e) => setValue("phone", e.target.value)} placeholder="رقم الهاتف" />
        <input value={form.country} onChange={(e) => setValue("country", e.target.value)} placeholder="الدولة" />
        <input value={form.city} onChange={(e) => setValue("city", e.target.value)} placeholder="المدينة" />
        <input value={form.district} onChange={(e) => setValue("district", e.target.value)} placeholder="الحي" />
        <input value={form.street} onChange={(e) => setValue("street", e.target.value)} placeholder="الشارع" />
        <input value={form.buildingNo} onChange={(e) => setValue("buildingNo", e.target.value)} placeholder="رقم المبنى" />
        <input value={form.floor} onChange={(e) => setValue("floor", e.target.value)} placeholder="الدور" />
        <input value={form.apartment} onChange={(e) => setValue("apartment", e.target.value)} placeholder="الشقة" />
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 10 }}>📍 اختر موقعك على الخريطة</h3>

        <MapPicker
          value={
            form.latitude && form.longitude
              ? { lat: Number(form.latitude), lng: Number(form.longitude) }
              : null
          }
          onSelect={async (pos) => {
            await reverseGeocode(pos.lat, pos.lng);
          }}
        />

        <div style={{ marginTop: 10, fontSize: 12, color: "#475569" }}>
          Lat: {form.latitude || "-"} | Lng: {form.longitude || "-"}
        </div>

        {isResolvingAddress && (
          <div style={{ marginTop: 8, fontSize: 13, color: "#2563eb" }}>
            جارٍ تعبئة العنوان من الخريطة...
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <button type="button" className="secondary-btn" onClick={detectLocation}>
            📡 تحديد موقعي تلقائيًا
          </button>

          <button type="button" className="secondary-btn" onClick={useMockLocation}>
            🧪 تعبئة عنوان تجريبي
          </button>
        </div>
      </div>

      <textarea
        value={form.notes}
        onChange={(e) => setValue("notes", e.target.value)}
        placeholder="ملاحظات إضافية للمندوب أو للإدارة"
        rows={4}
        style={{ marginTop: 16 }}
      />

      <div className="address-form__actions">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setValue("isDefault", e.target.checked)}
          />
          <span>اجعل هذا العنوان افتراضيًا</span>
        </label>

        <div className="address-action-buttons">
          {typeof onCancel === "function" && (
            <button type="button" className="secondary-btn" onClick={onCancel}>
              إلغاء
            </button>
          )}

          <button type="submit" className="primary-btn">
            حفظ العنوان
          </button>
        </div>
      </div>
    </form>
  );
}
