export default function AdminSocialCampaignCard({ item }) {
  return (
    <div className="admin-social-card">
      <h3>{item.title}</h3>
      <p><strong>??????:</strong> {item.channel}</p>
      <p><strong>?????:</strong> {item.objective}</p>
      <button className="secondary-btn" type="button">
        ???? ????? ??????
      </button>
    </div>
  );
}
