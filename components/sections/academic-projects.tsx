import type { AcademicProjectItem } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/section-heading";

export function AcademicProjects({ items }: { items: AcademicProjectItem[] }) {
  if (!items.length) return null;

  return <section className="content-section academic-section" id="academic-projects" aria-labelledby="academic-projects-title">
    <div className="chapter-kicker"><span>07</span><span>Academic work / University engineering projects</span></div>
    <SectionHeading id="academic-projects-title" eyebrow="UNIVERSITY PROJECTS / SIMULATION / IMAGE PROCESSING" title="Academic Projects" description="Selected engineering projects from university — traffic optimization with VANETs and biometric palmprint recognition." />
    <div className="academic-project-grid" aria-label="Academic projects">
      {items.map((item, index) => <article className="academic-project-card" key={item.title}>
        <div className="academic-project-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{item.context}</span>
          <span>{item.period}</span>
        </div>
        <h3>{item.title}</h3>
        <p className="academic-project-summary">{item.summary}</p>
        <ul className="academic-project-highlights" aria-label={`${item.title} highlights`}>
          {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
        <ul className="secondary-project-tech" aria-label={`${item.title} technologies`}>
          {item.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </article>)}
    </div>
  </section>;
}
