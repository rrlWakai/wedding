type Props = {
  text?: string;
  linkLabel?: string;
  href?: string;
};

type ItemProps = Required<Props> & { interactive: boolean };

function AnnouncementItem({ text, linkLabel, href, interactive }: ItemProps) {
  return (
    <span className="announce-item">
      <span className="announce-text">{text}</span>
      <i className="announce-dot" aria-hidden="true" />
      <a className="announce-link" href={href} tabIndex={interactive ? undefined : -1}>
        {linkLabel}
      </a>
      <i className="announce-orn" aria-hidden="true">
        <svg viewBox="0 0 12 12" focusable="false">
          <path d="M6 0 7.3 4.7 12 6 7.3 7.3 6 12 4.7 7.3 0 6 4.7 4.7Z" />
        </svg>
      </i>
    </span>
  );
}

const REPEAT = 5;

export default function AnnouncementStrip({
  text = 'Save the date: December 2, 2026 in Malibu, California',
  linkLabel = 'RSVP',
  href = '#rsvp',
}: Props) {
  const item = { text, linkLabel, href };

  return (
    <section className="announce" role="region" aria-label="Announcement">
      <div className="announce-track">
        <div className="announce-group">
          {Array.from({ length: REPEAT }, (_, i) => (
            <AnnouncementItem key={i} {...item} interactive />
          ))}
        </div>
        <div className="announce-group" aria-hidden="true">
          {Array.from({ length: REPEAT }, (_, i) => (
            <AnnouncementItem key={i} {...item} interactive={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
