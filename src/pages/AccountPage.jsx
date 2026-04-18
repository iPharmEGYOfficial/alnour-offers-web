import AccountSidebar from "../components/account/AccountSidebar";

export default function AccountPage() {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <AccountSidebar />
      <div>
        <h2>حسابي</h2>
      </div>
    </div>
  );
}