import AddressForm from "../components/account/AddressForm";

export default function AddressesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>العناوين</h2>
      <AddressForm onSave={(data) => console.log(data)} />
    </div>
  );
}
