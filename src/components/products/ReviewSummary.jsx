function renderStars(value) {
  const rounded = Math.round(Number(value || 0));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export default function ReviewSummary({ average = 0, total = 0 }) {
  return (
    <div className="review-summary">
      <div className="review-summary__score">
        <strong>{Number(average).toFixed(1)}</strong>
        <span>{renderStars(average)}</span>
      </div>

      <div className="review-summary__meta">
        <h3>ملخص التقييمات</h3>
        <p>
          بناءً على <strong>{total}</strong> مراجعة
        </p>
      </div>
    </div>
  );
}
