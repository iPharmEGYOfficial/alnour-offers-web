import { useState } from "react";
import MapPicker from "../maps/MapPicker";

const initialState = {
  label: "",
  fullName: "",
  phone: "",
  country: "Saudi Arabia",
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
  const [showMap, setShowMap] = useState(false);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function reverseGeocode(lat, lng) {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`;
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!res.ok) throw new Error("reverse geocode failed");

      const data = await res.json();
      const addr = data.address || {};

      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        country: addr.country || prev.country || "Saudi Arabia",
        city:
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state ||
          prev.city,
        district:
          addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.city_district ||
          prev.district,
        street:
          addr.road ||
          addr.pedestrian ||
          addr.footway ||
          addr.residential ||
          prev.street,
        buildingNo:
          addr.house_number ||
          prev.buildingNo
      }));
    } catch {
      alert("تم تحديد الموقع على الخريطة، لكن تعذر جلب تفاصيل العنوان تلقائيًا. أكمل البيانات يدويًا.");
    }
  }

  const detectLocation = () => {
    setShowMap(true);

    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      },
      () => alert("تعذر تحديد الموقع"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useMockLocation = async () => {
    setShowMap(true);

    setForm((prev) => ({
      ...prev,
      label: prev.label || "المنزل",
      fullName: prev.fullName || "هيثم أسامة",
      phone: prev.phone || "0535272372",
      country: prev.country || "Saudi Arabia",
      city: prev.city || "الخرمة",
      district: prev.district || "الخزيمة",
      street: prev.street || "طريق الملك فهد",
      buildingNo: prev.buildingNo || "101",
      floor: prev.floor || "1",
      apartment: prev.apartment || "1",
      notes: prev.notes || "بجوار مجمع أهالي الخرمة الطبي العام."
    }));

    await reverseGeocode(21.9167, 42.85);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.city.trim()) {
      alert("من فضلك أدخل الاسم ورقم الجوال والمدينة");
      return;
    }

    onSave(form);
    setForm(initialState);
  };

  return (
    <form className="address-form" onSubmit={submit} dir="rtl">
      <div className="address-form__grid">
        <input value={form.label} onChange={(e) => setValue("label", e.target.value)} placeholder="اسم العنوان" />
        <input value={form.fullName} onChange={(e) => setValue("fullName", e.target.value)} placeholder="اسم المستلم" />
        <input value={form.phone} onChange={(e) => setValue("phone", e.target.value)} placeholder="رقم الجوال" />
        <input value={form.country} onChange={(e) => setValue("country", e.target.value)} placeholder="الدولة" />
        <input value={form.city} onChange={(e) => setValue("city", e.target.value)} placeholder="المدينة" />
        <input value={form.district} onChange={(e) => setValue("district", e.target.value)} placeholder="الحي" />
        <input value={form.street} onChange={(e) => setValue("street", e.target.value)} placeholder="الشارع" />
        <input value={form.buildingNo} onChange={(e) => setValue("buildingNo", e.target.value)} placeholder="رقم المبنى" />
        <input value={form.floor} onChange={(e) => setValue("floor", e.target.value)} placeholder="الدور" />
        <input value={form.apartment} onChange={(e) => setValue("apartment", e.target.value)} placeholder="الشقة" />
      </div>

      <div style={{ marginTop: 18, padding: 14, border: "1px solid #dbeafe", borderRadius: 14, background: "#eff6ff" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>اختيار الموقع على الخريطة</h3>

        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <button type="button" className="secondary-btn" onClick={() => setShowMap((v) => !v)}>
            {showMap ? "إخفاء الخريطة" : "فتح الخريطة الكاملة"}
          </button>

          <button type="button" className="secondary-btn" onClick={detectLocation}>
            تحديد موقعي الحالي
          </button>

          <button type="button" className="secondary-btn" onClick={useMockLocation}>
            استخدام عنوان تجريبي
          </button>
        </div>

        {showMap && (
          <div style={{ height: 420, borderRadius: 14, overflow: "hidden", border: "1px solid #bfdbfe", background: "#fff" }}>
            <MapPicker
              value={form.latitude && form.longitude ? { lat: Number(form.latitude), lng: Number(form.longitude) } : null}
              onSelect={async (pos) => {
                await reverseGeocode(pos.lat, pos.lng);
              }}
            />
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>
          Lat: {form.latitude || "-"} | Lng: {form.longitude || "-"}
        </div>
      </div>

      <textarea
        value={form.notes}
        onChange={(e) => setValue("notes", e.target.value)}
        placeholder="ملاحظات إضافية"
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
          <span>جعله العنوان الافتراضي</span>
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

