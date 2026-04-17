export default function AdminSocialCampaignCard({ item }) {
  return (
    <div className="admin-social-card">
      <h3>{item.title}</h3>
      <p><strong>القناة:</strong> {item.channel}</p>
      <p><strong>الهدف:</strong> {item.objective}</p>
      <button className="secondary-btn" type="button">
        فتح خطة الحملة
      </button>
    </div>
  );
}

