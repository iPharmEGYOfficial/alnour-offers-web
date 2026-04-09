import { socialChannels } from "../../config/socialChannels";

export default function SocialBar({ title = "????? ???????", compact = false }) {
  return (
    <section className={compact ? "social-bar compact" : "social-bar"}>
      <div className="social-bar__head">
        <h3>{title}</h3>
        {!compact && (
          <p>????? ????? ??????? ???????? ????? ??????? ???? ???????? ????</p>
        )}
      </div>

      <div className="social-bar__grid">
        {socialChannels.map((item) => (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="social-card"
          >
            <span className="social-card__icon">{item.icon}</span>
            <div className="social-card__content">
              <strong>{item.label}</strong>
              <small>{item.note}</small>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
