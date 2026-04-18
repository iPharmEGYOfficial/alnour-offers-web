import { useState } from "react";

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

export default function AddressForm({ onSave }) {
  const [form, setForm] = useState(initialState);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const useMockLocation = () => {
    setForm((prev) => ({
      ...prev,
      label: prev.label || "المنزل",
      fullName: prev.fullName || "هيثم أسامة",
      phone: prev.phone || "966598918692",
      city: prev.city || "الخرمة",
      district: prev.district || "حي النزهه",
      street: prev.street || "طريق الملك فهد",
      buildingNo: prev.buildingNo || "4273",
      floor: prev.floor || "1",
      apartment: prev.apartment || "2",
      latitude: prev.latitude || "21.9167",
      longitude: prev.longitude || "42.8500",
      notes: prev.notes || "عنوان تجريبي منظم لاختبار التوصيل داخل المشروع."
    }));
  };

  const submit = (e) => {
    e.preventDefault();
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
        <input value={form.latitude} onChange={(e) => setValue("latitude", e.target.value)} placeholder="Latitude" />
        <input value={form.longitude} onChange={(e) => setValue("longitude", e.target.value)} placeholder="Longitude" />
      </div>

      <textarea
        value={form.notes}
        onChange={(e) => setValue("notes", e.target.value)}
        placeholder="ملاحظات إضافية للمندوب أو للإدارة"
        rows={4}
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
          <button type="button" className="secondary-btn" onClick={useMockLocation}>
            تعبئة عنوان تجريبي
          </button>
          <button type="submit" className="primary-btn">
            حفظ العنوان
          </button>
        </div>
      </div>
    </form>
  );
}