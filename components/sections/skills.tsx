import type { SkillGroup } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/section-heading";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return <section className="content-section" id="skills">
    <SectionHeading id="skills-title" eyebrow="Engineering index" title="What I work with" description="A working index across infrastructure, networks, software, and delivery." />
    <div className="systems-map">
      {groups.map((group, index) => <article className="system-node" key={group.category}>
        <div className="system-node-heading"><span className="system-index">{String(index + 1).padStart(2, "0")}</span><h3>{group.category}</h3></div>
        <ul className="tag-list">{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </article>)}
    </div>
  </section>;
}
