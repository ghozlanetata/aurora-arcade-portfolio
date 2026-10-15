import type { CertificationItem, EducationItem } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/section-heading";

export function Certifications({ items, education }: { items: CertificationItem[]; education: EducationItem[] }) {
  return <section className="content-section certifications-section" id="certifications" aria-labelledby="certifications-title">
    <div className="chapter-kicker"><span>06</span><span>Certifications / Credentials &amp; study</span></div>
    <SectionHeading id="certifications-title" eyebrow="PROFESSIONAL CREDENTIALS" title="Certifications" description="Earned credentials and formal education." />
    <div className="credential-list">
      {items.map((item, index) => <article className={`credential-entry${index === 0 ? " credential-featured" : ""}`} key={item.name}>
        <span className="credential-index">0{index + 1}</span>
        <div className="credential-name"><h3>{item.name}</h3><p>{item.issuer}</p></div>
        <p className="credential-date">{item.date}</p>
        {item.credentialUrl && <a className="text-link" href={item.credentialUrl} target="_blank" rel="noreferrer">Verify <span aria-hidden="true">↗</span><span className="sr-only"> credential (opens in a new tab)</span></a>}
      </article>)}
    </div>
    <div className="education-block">
      <div className="education-heading"><p className="eyebrow">FORMAL EDUCATION</p><h3>Networks &amp; Telecommunications</h3></div>
      <div className="education-list">{education.map((item) => <article className={`education-entry${item.featured ? " education-entry-featured" : ""}`} key={item.qualification}>
        <div><h4>{item.qualification}</h4><p>{item.institution}</p>{item.detail && <p>{item.detail}</p>}</div>
        <p className="education-period">{item.period}</p>
      </article>)}</div>
    </div>
  </section>;
}
