import { useState } from "react";
import AddressForm from "../components/account/AddressForm";
import AddressCard from "../components/account/AddressCard";
import useAccountStore from "../store/accountStore";

export default function AddressesPage() {
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const updateAddress = useAccountStore((s) => s.updateAddress);
  const deleteAddress = useAccountStore((s) => s.deleteAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(addresses.length === 0);

  function handleSave(data) {
    if (editingAddress) {
      updateAddress(editingAddress.id, data);
      setEditingAddress(null);
    } else {
      addAddress(data);
    }

    setShowForm(false);
  }

  function handleEdit(address) {
    setEditingAddress(address);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    deleteAddress(id);
    if (editingAddress?.id === id) {
      setEditingAddress(null);
      setShowForm(false);
    }
  }

  function handleAddNew() {
    setEditingAddress(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingAddress(null);
    setShowForm(false);
  }

  return (
    <section className="catalog-section" dir="rtl">
      <div className="catalog-section__head">
        <div>
          <h2>العناوين</h2>
          <p>إدارة عناوين التوصيل الخاصة بك</p>
        </div>

        {!showForm && (
          <button type="button" onClick={handleAddNew} style={primaryBtn}>
            + إضافة عنوان جديد
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {showForm && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>
              {editingAddress ? "تعديل العنوان" : "إضافة عنوان جديد"}
            </h3>

            <AddressForm
              initialValues={editingAddress || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {!addresses.length ? (
          !showForm && (
            <div className="catalog-message">لا توجد عناوين محفوظة حاليًا.</div>
          )
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                item={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={setDefaultAddress}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
};

const primaryBtn = {
  padding: "11px 15px",
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};
