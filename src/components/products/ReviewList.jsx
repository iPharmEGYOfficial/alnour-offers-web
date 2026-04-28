function renderStars(value) {
  const rounded = Math.round(Number(value || 0));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div className="status-box">
        لا توجد مراجعات متاحة لهذا المنتج حتى الآن
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <article
          key={review.id || review.ratingID || index}
          className="review-card"
        >
          <div className="review-card__head">
            <div>
              <h4>{review.customerName || review.authorName || "عميل"}</h4>
              <div className="review-stars">
                {renderStars(review.ratingValue || review.stars || 0)}
              </div>
            </div>

            <div className="review-badges">
              {review.verifiedPurchase && (
                <span className="verified-badge">شراء موثق</span>
              )}
              <span className="review-date">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("ar-SA")
                  : ""}
              </span>
            </div>
          </div>

          {review.title && <h5 className="review-title">{review.title}</h5>}

          <p className="review-text">
            {review.comment || review.reviewText || "لا توجد أي ملاحظات."}
          </p>

          {review.adminReply && (
            <div className="review-admin-reply">
              <strong>رد الإدارة:</strong>
              <p>{review.adminReply}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}









