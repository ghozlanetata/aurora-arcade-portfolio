import { SectionHeading } from "@/components/ui/section-heading";
import type { ExperienceItem } from "@/content/portfolio";

export function Experience({ items, activeCompany }: { items: ExperienceItem[]; activeCompany: string }) {
  return <section className="content-section experience-section" id="experience" aria-labelledby="experience-title">
    <div className="chapter-kicker"><span>05</span><span>Experience / Technical delivery</span></div>
    <SectionHeading id="experience-title" eyebrow="CAREER" title="Roles & responsibilities" description="Roles, technical responsibilities, and project delivery across my experience." />
    <div className="timeline">
      {items.map((item, index) => <details className="timeline-item" data-company={item.company} id={`career-entry-${index}`} key={item.company} open={item.company === activeCompany}>
        <summary className="timeline-summary">
          <span className="timeline-marker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span className="timeline-date">{item.period}{item.location && <span>{item.location}</span>}</span>
          <span className="timeline-title"><span className="timeline-role">{item.role}</span><span className="entry-org">{item.organization}</span></span>
          <span className="timeline-toggle" aria-hidden="true" />
        </summary>
        <div className="timeline-detail">
          <p>{item.summary}</p>
          {item.groups.map((group) => <div className="experience-group" key={group.heading}>
            <h3>{group.heading}</h3>
            <ul className="detail-list">{group.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </div>)}
        </div>
      </details>)}
    </div>
  </section>;
}
