export default function AdminSocialCampaignCard({ item }) {
  return (
    <div className="admin-social-card">
      <h3>{item.title || "حملة بدون عنوان"}</h3>
      <p><strong>القناة:</strong> {item.channel || "غير محددة"}</p>
      <p><strong>الهدف:</strong> {item.objective || "غير محدد"}</p>
      {item.audience && <p><strong>الجمهور:</strong> {item.audience}</p>}
      {item.frequency && <p><strong>التكرار:</strong> {item.frequency}</p>}
      <button className="secondary-btn" type="button">
        فتح خطة الحملة
      </button>
    </div>
  );
}









