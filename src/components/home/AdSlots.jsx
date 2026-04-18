export default function AdSlots() {
  const slots = [
    {
      id: 1,
      title: "توصيل سريع داخل المدينة",
      text: "خدمة أسرع وتجربة أوضح لطلبات العملاء اليومية."
    },
    {
      id: 2,
      title: "عروض موسمية مختارة",
      text: "خصومات ومحتوى تسويقي مناسب للأجهزة والمنتجات الطبية."
    },
    {
      id: 3,
      title: "دعم مباشر عبر واتساب",
      text: "سهولة في التواصل مع الصيدلية والمتابعة بعد الطلب."
    }
  ];

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>مساحات إعلانية ذكية</h2>
          <p>رسائل قصيرة تدعم البيع وتوضح مزايا الخدمة</p>
        </div>
      </div>

      <div className="product-grid">
        {slots.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-body">
              <div className="product-name">{item.title}</div>
              <div className="product-brand">رسالة تسويقية</div>
              <p className="subtle" style={{ lineHeight: 1.8 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}